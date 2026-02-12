// ===== Task System =====
function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value;

  if (task.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = task;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
  }
}

// ===== Focus Timer =====
let time = 1500; // 25 minutes
let interval;

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      alert("Focus session complete!");
      time = 1500;
      updateDisplay();
      return;
    }

    time--;
    updateDisplay();
  }, 1000);
}

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").textContent =
    `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
