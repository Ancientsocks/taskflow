
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch(`${API}/tasks`);
      if (!response.ok) throw new Error("Could not load tasks");
      setTasks(await response.json());
      setError("");
    } catch {
      setError("Cannot connect to TaskFlow API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function createTask(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not create task");

      setTitle("");
      setDescription("");
      setError("");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error("Could not update task");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete task");
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container">
      <header>
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>TaskFlow</h1>
        <p>Plan your work. Track your progress.</p>
      </header>

      <form className="task-form" onSubmit={createTask}>
        <h2>Create a task</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          maxLength={200}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
        />
        <button type="submit">+ Add task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="task-section">
        <h2>Your tasks ({tasks.length})</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Create your first task above.</p>
        ) : (
          tasks.map((task) => (
            <article className="task-card" key={task.id}>
              <label className={task.completed ? "completed" : ""}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />
                <span>{task.title}</span>
              </label>
              {task.description && <p>{task.description}</p>}
              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

