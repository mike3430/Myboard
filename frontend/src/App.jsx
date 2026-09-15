import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const todoTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");

  const schoolTasks = tasks.filter(task => task.category === "School");
  const generalTasks = tasks.filter(task => task.category === "General");

  const schoolTodo = tasks.filter(
  task => task.category === "School" && !task.completed);

  const schoolCompleted = tasks.filter(
  task => task.category === "School" && task.completed);

  const generalTodo = tasks.filter(
  task => task.category === "General" && !task.completed);

  const generalCompleted = tasks.filter(
  task => task.category === "General" && task.completed);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/tasks")
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

function addTask() {
  if (newTask.trim() === "") {
    return;
  }

  fetch("http://127.0.0.1:8000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: newTask,
      category: category,
      due_date: dueDate
    })
  })
    .then(response => response.json())
    .then(data => {
      setTasks([...tasks, data]);
      setNewTask("");
      setDueDate("");
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

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function undoComplete(id) {
  fetch(`http://127.0.0.1:8000/tasks/${id}/undo`, {
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

return (
  <div>
    <h1>Teamboard</h1>

    <input
      type="text"
      value={newTask}
      onChange={(event) => setNewTask(event.target.value)}
      placeholder="Enter a task"
    />

    <select
      value={category}
      onChange={(event) => setCategory(event.target.value)}
    >
      <option value="General">General</option>
      <option value="School">School</option>
    </select>

    <input
      type="date"
      value={dueDate}
      onChange={(event) => setDueDate(event.target.value)}
    />

    <button onClick={addTask}>Add Task</button>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "60px",
        marginTop: "30px"
      }}
    >
      {/* SCHOOL COLUMN */}
      <div style={{ textAlign: "center" }}>
        <h2>School Tasks</h2>

        <h3>To Do</h3>

        {schoolTodo.map(task => (
          <div key={task.id}>
            <div>
              <span>{task.title}</span>

              {task.due_date && (
                <span> — Due: {formatDate(task.due_date)}</span>
              )}
            </div>

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

        <h3>Completed</h3>

        {schoolCompleted.map(task => (
          <div key={task.id}>
            <div>
              <span style={{ textDecoration: "line-through" }}>
                {task.title}
              </span>

              {task.due_date && (
                <span> — Due: {formatDate(task.due_date)}</span>
              )}
            </div>

            <button onClick={() => editTask(task.id, task.title)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>

            <button onClick={() => undoComplete(task.id)}>
              Undo
            </button>

          </div>
        ))}
      </div>

      {/* GENERAL COLUMN */}
      <div style={{ textAlign: "center" }}>
        <h2>General Tasks</h2>

        <h3>To Do</h3>

        {generalTodo.map(task => (
          <div key={task.id}>
            <div>
              <span>{task.title}</span>

              {task.due_date && (
                <span> — Due: {formatDate(task.due_date)}</span>
              )}
            </div>

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

        <h3>Completed</h3>

        {generalCompleted.map(task => (
          <div key={task.id}>
            <div>
              <span style={{ textDecoration: "line-through" }}>
                {task.title}
              </span>

              {task.due_date && (
                <span> — Due: {formatDate(task.due_date)}</span>
              )}
            </div>

            <button onClick={() => editTask(task.id, task.title)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task.id)}>
              Delete
            </button>

            <button onClick={() => undoComplete(task.id)}>
              Undo
            </button>
            
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default App;
