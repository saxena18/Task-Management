class Task {
  constructor(id, description) {
    this.id = id;
    this.description = description;
    this.completed = false;
  }
}

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  addTask(description) {
    const task = new Task(Date.now(), description);
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasks();
  }

  editTask(id, description) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.description = description;
      this.saveTasks();
    }
  }
}

const taskManager = new TaskManager();
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");

function renderTasks() {
  taskList.innerHTML = "";
  taskManager.tasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.innerHTML = `
          ${task.description}
          <span class="edit">Edit</span>
          <span class="delete">Delete</span>
      `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = taskInput.value.trim();
  if (description) {
    taskManager.addTask(description);
    renderTasks();
    taskInput.value = "";
  }
});

taskList.addEventListener("click", (e) => {
  const id = Number(e.target.parentElement.getAttribute("data-id"));
  if (e.target.classList.contains("delete")) {
    taskManager.deleteTask(id);
    renderTasks();
  } else if (e.target.classList.contains("edit")) {
    const description = prompt(
      "Edit task",
      e.target.parentElement.firstChild.textContent
    );
    if (description) {
      taskManager.editTask(id, description);
      renderTasks();
    }
  }
});
document.addEventListener("DOMContentLoaded", renderTasks);
