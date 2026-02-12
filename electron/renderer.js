const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const errorBox = document.getElementById("taskError");
const logoutBtn = document.getElementById("logoutBtn");

function showError(message) {
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function clearError() {
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function renderTaskItem(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task._id;

  const label = document.createElement("span");
  label.textContent = task.title;
  if (task.completed) {
    label.classList.add("task-completed");
  }

  const controls = document.createElement("div");
  controls.className = "task-controls";

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = task.completed ? "Undo" : "Done";
  toggleBtn.addEventListener("click", async () => {
    clearError();
    const res = await window.apiService.apiRequest(`/api/tasks/${task._id}`, {
      method: "PUT",
      auth: true,
      body: { completed: !task.completed },
    });
    if (!res.ok) {
      showError(res.message || "Failed to update task.");
      return;
    }
    await loadTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async () => {
    clearError();
    const res = await window.apiService.apiRequest(`/api/tasks/${task._id}`, {
      method: "DELETE",
      auth: true,
    });
    if (!res.ok) {
      showError(res.message || "Failed to delete task.");
      return;
    }
    await loadTasks();
  });

  controls.appendChild(toggleBtn);
  controls.appendChild(deleteBtn);
  li.appendChild(label);
  li.appendChild(controls);
  return li;
}

async function loadTasks() {
  clearError();
  const res = await window.apiService.apiRequest("/api/tasks", { auth: true });
  if (!res.ok) {
    if (res.status === 401) {
      await window.authService.logout();
      return;
    }
    showError(res.message || "Failed to load tasks.");
    return;
  }

  taskList.innerHTML = "";
  res.tasks.forEach((task) => {
    taskList.appendChild(renderTaskItem(task));
  });
}

async function addTask() {
  clearError();
  const title = taskInput.value.trim();
  if (!title) return;

  const res = await window.apiService.apiRequest("/api/tasks", {
    method: "POST",
    auth: true,
    body: { title },
  });

  if (!res.ok) {
    showError(res.message || "Failed to add task.");
    return;
  }

  taskInput.value = "";
  await loadTasks();
}

document.addEventListener("DOMContentLoaded", async () => {
  await window.authService.requireAuth();
  await loadTasks();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => window.authService.logout());
  }
});

window.addTask = addTask;
