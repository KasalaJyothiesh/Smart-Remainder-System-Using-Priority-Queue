const newTodoInput = document.getElementById("task");
const prioritySelect = document.getElementById("priority");
const timeInput = document.getElementById("time");
const todoList = document.getElementById("task-list");

let tasks = [];
const priorityOrder = { High: 3, Medium: 2, Low: 1 };

// Ask for notification permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Function triggered by button onclick
function addTask() {
  const taskText = newTodoInput.value.trim();
  const priority = prioritySelect.value;
  const time = timeInput.value;

  if (taskText === "") return;

  const task = { text: taskText, priority, time };
  tasks.push(task);

  // Sort tasks by priority (High > Medium > Low)
  tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  // Render tasks
  renderTasks();

  // Instant notify if High priority
  if (priority === "High" && Notification.permission === "granted") {
    new Notification("⚡ High Priority Task Added!", { body: taskText });
  }

  // Schedule reminder if time is set
  if (time) {
    scheduleReminder(task);
  }

  // Reset inputs
  newTodoInput.value = "";
  timeInput.value = "";
}

function renderTasks() {
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item", `priority-${task.priority}`);

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.text}</strong>
        <small>
          Priority: <span class="priority-label">${task.priority}</span>
          ${
            task.time
              ? ` | Reminder: ${new Date(task.time).toLocaleString()}`
              : ""
          }
        </small>
      </div>
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;

    todoList.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function scheduleReminder(task) {
  const reminderTime = new Date(task.time).getTime();
  const now = new Date().getTime();
  const delay = reminderTime - now;

  if (delay > 0) {
    setTimeout(() => {
      // Fallback alert
      alert(`🔔 Reminder: ${task.text}`);

      // Desktop notification if allowed
      if (Notification.permission === "granted") {
        new Notification("🔔 Task Reminder", { body: task.text });
      }
    }, delay);
  }
}
