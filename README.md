# TaskFlow — Full-Stack Task Management Application

TaskFlow is a full-stack task management web application built to explore modern software development practices. It allows users to create, view, complete, and delete tasks through a React-based user interface connected to a Python FastAPI backend and a PostgreSQL database.

## Features

- **Create Tasks:** Add tasks with a title and description.
- **View Tasks:** Retrieve and display tasks in the application.
- **Update Task Status:** Mark tasks as completed or incomplete.
- **Delete Tasks:** Remove tasks that are no longer needed.
- **REST API:** Communicate between the frontend and backend using HTTP requests.
- **Persistent Storage:** Store task data in PostgreSQL.
- **API Documentation:** Explore and test endpoints through FastAPI's Swagger UI.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend application logic |
| FastAPI | REST API development |
| Pydantic | Request data validation |
| SQLAlchemy | Database interaction and ORM |
| PostgreSQL | Relational database |
| React | Frontend user interface |
| Vite | Frontend development server and build tool |
| JavaScript, HTML, CSS | Frontend development |
| Git and GitHub | Version control and source-code hosting |

## Architecture

```text
User
 |
 v
React Frontend (Vite)
 |
 | HTTP / REST API
 v
FastAPI Backend
 |
 | SQLAlchemy ORM
 v
PostgreSQL Database
```

### How It Works

1. The user performs an action in the React frontend.
2. The frontend sends an HTTP request to the FastAPI backend.
3. FastAPI validates the incoming data and processes the request.
4. SQLAlchemy interacts with PostgreSQL to retrieve or modify task records.
5. FastAPI returns a response, and React updates the interface.

## Project Structure

```text
taskflow/
├── app/
│   ├── database/
│   ├── models/
│   ├── __init__.py
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

*Note: Adjust the folder tree if your actual project structure differs.*

## Prerequisites

Install the following before running the application:

- Python 3.10 or newer
- Node.js and npm
- PostgreSQL
- Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ancientsocks/taskflow.git
cd taskflow
```

### 2. Set up the Python backend

Create and activate a virtual environment using Git Bash on Windows:

```bash
python -m venv .venv1
source .venv1/Scripts/activate
```

Install the Python dependencies using the dependency file provided by the project. For example, if you have `requirements.txt`:

```bash
pip install -r requirements.txt
```

If the project uses `pyproject.toml` or another dependency manager instead, follow that configuration.

### 3. Configure PostgreSQL

Create a PostgreSQL database and user for TaskFlow. For example, connect to PostgreSQL as an administrator and run:

```sql
CREATE USER taskflow WITH LOGIN PASSWORD 'your_local_password';
CREATE DATABASE taskflow OWNER taskflow;
```

Configure the database connection using the environment variable expected by your backend. For example, if the code uses `DATABASE_URL`:

```text
postgresql+psycopg://taskflow:your_local_password@localhost:5432/taskflow
```

Use the correct database driver and variable name from your actual configuration. Keep real credentials in a local `.env` file or environment variables, and never commit secrets to GitHub.

### 4. Start the backend

From the project root, with your virtual environment activated:

```bash
python -m uvicorn app.main:app --reload
```

The backend should be available at:

- API base URL: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. Depending on port availability, it may be `http://localhost:5173` or another port such as `http://localhost:5174`.

Ensure the frontend API URL matches the backend address and that the backend CORS configuration allows the frontend's origin.

## API Overview

The application provides task-management endpoints for the following operations:

| HTTP Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

Use the interactive Swagger documentation at `/docs` to confirm the exact endpoint paths, request formats, and response schemas implemented in the current code.

## Learning Outcomes

This project provided practical experience with:

- Developing a full-stack application.
- Building REST APIs using FastAPI.
- Connecting Python applications to PostgreSQL.
- Using SQLAlchemy for database operations.
- Implementing CRUD functionality.
- Connecting a React frontend to a backend API.
- Testing API endpoints with Swagger UI.
- Managing source code with Git and GitHub.

## Future Improvements

Potential enhancements include:

- User registration and authentication.
- Task priorities, categories, and due dates.
- Search, filtering, and sorting.
- Automated backend and frontend tests.
- Docker-based development and deployment.
- Deployment to a cloud platform.

These are potential future enhancements and are not claimed as existing features.

## Repository

GitHub: https://github.com/Ancientsocks/taskflow

## License

No license has been specified yet. Add a license file if you intend to permit others to reuse, modify, or distribute the project.
