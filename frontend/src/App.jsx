import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const todoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

function addTask() {
  fetch("http://127.0.0.1:8000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: newTask
    })
  })
    .then(response => response.json())
    .then(data => {
      setTasks([...tasks, data]);
      setNewTask("");
    });
}

function deleteTask(id) {
  fetch(`http://127.0.0.1:8000/tasks/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      setTasks(tasks.filter(task => task.id !== id));
    });
}

function completeTask(id) {
  fetch(`http://127.0.0.1:8000/tasks/${id}/complete`, {
    method: "PUT"
  })
    .then(response => response.json())
    .then(updatedTask => {
      setTasks(
        tasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );
    });
}

function editTask(id, currentTitle) {
  const newTitle = prompt("Enter a new task title:", currentTitle);

  if (newTitle === null || newTitle.trim() === "") {
    return;
  }

  fetch(`http://127.0.0.1:8000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: newTitle
    })
  })
    .then(response => response.json())
    .then(updatedTask => {
      setTasks(
        tasks.map(task =>
          task.id === id ? updatedTask : task
        )
      );
    });
}

  return (
    <div>
      <h1>Myboard</h1>

      <input
        type="text"
        value={newTask}
        onChange={(event) => setNewTask(event.target.value)}
        placeholder="Enter a task"
      />

      <button onClick={addTask}>
        Add Task
      </button>
      
      <h2>To Do</h2>

      {todoTasks.map(task => (
        <div key={task.id}>
          <span>{task.title}</span>

          <button onClick={() => completeTask(task.id)}>
            Complete
          </button>

          <button onClick={() => editTask(task.id, task.title)}>
            Edit
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}

      <h2>Completed</h2>

      {completedTasks.map(task => (
        <div key={task.id}>
          <span
            style={{
              textDecoration: "line-through"
            }}
          >
            {task.title}
          </span>

          <button onClick={() => editTask(task.id, task.title)}>
            Edit
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
