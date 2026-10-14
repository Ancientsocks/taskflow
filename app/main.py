
from contextlib import asynccontextmanager
from typing import Generator

from fastapi.middleware.cors import CORSMiddleware

from fastapi import Depends, FastAPI, HTTPException, Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.database import Base, SessionLocal, engine
from app.models.models import Task


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="TaskFlow API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174",
    "http://127.0.0.1:5174",],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description: str | None = None
    completed: bool | None = None


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    completed: bool


@app.get("/")
def home():
    return {"message": "TaskFlow API is running!"}


@app.post("/tasks", response_model=TaskRead, status_code=201)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
):
    if not data.title.strip():
        raise HTTPException(400, "Task title cannot be empty")

    task = Task(
        title=data.title.strip(),
        description=data.description,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.get("/tasks", response_model=list[TaskRead])
def get_tasks(db: Session = Depends(get_db)):
    return db.scalars(select(Task).order_by(Task.id)).all()


@app.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(404, "Task not found")
    return task


@app.patch("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(404, "Task not found")

    changes = data.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(400, "Provide at least one field")

    for field, value in changes.items():
        if value is None:
            raise HTTPException(400, f"{field} cannot be null")
        if field == "title":
            value = value.strip()
            if not value:
                raise HTTPException(400, "Task title cannot be empty")
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if task is None:
        raise HTTPException(404, "Task not found")

    db.delete(task)
    db.commit()
    return Response(status_code=204)



