from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
#when someone sends a tasks it will have a title:
class Task(BaseModel):
    title: str

@app.get("/")
def home():
    return {"message": "Teamboard API is running"}

@app.get("/tasks")
def get_tasks():
    connection = get_connection()

    rows = connection.execute(
        "SELECT id, title, completed FROM tasks"
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]

@app.post("/tasks")
def add_task(task: Task):
    connection = get_connection()

    cursor = connection.execute(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)",
        (task.title, 0)
    )

    connection.commit()

    new_task = {
        "id": cursor.lastrowid,
        "title": task.title,
        "completed": False
    }

    connection.close()

    return new_task

@app.put("/tasks/{task_id}/complete")
def complete_task(task_id: int):
    connection = get_connection()

    connection.execute(
        "UPDATE tasks SET completed = 1 WHERE id = ?",
        (task_id,)
    )

    connection.commit()

    row = connection.execute(
        "SELECT id, title, completed FROM tasks WHERE id = ?",
        (task_id,)
    ).fetchone()

    connection.close()

    if row is None:
        return {"message": "Task not found"}

    return dict(row)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    connection = get_connection()

    connection.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Task deleted"}