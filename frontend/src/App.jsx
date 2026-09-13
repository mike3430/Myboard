import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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

  return (
    <div>
      <h1>Teamboard</h1>

      <input
        type="text"
        value={newTask}
        onChange={(event) => setNewTask(event.target.value)}
        placeholder="Enter a task"
      />

      <button onClick={addTask}>
        Add Task
      </button>

      {tasks.map(task => (
        <div key={task.id}>
          <span>{task.title}</span>
          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
