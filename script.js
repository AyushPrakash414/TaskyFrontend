const backendURL = "http://localhost:8080/user";

function showMessage(msg) {
  const m = document.getElementById("message");
  if (m) m.innerText = msg;
}

// 🟢 Signup
function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  fetch(`${backendURL}/signing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: username, password, email })
  })
    .then(res => res.text())
    .then(msg => showMessage(msg));
}

// 🟢 Login
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch(`${backendURL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.userName) {
        localStorage.setItem("username", data.userName);
        localStorage.setItem("tasks", JSON.stringify(data.remainingWork || []));
        window.location.href = "dashboard.html";
      } else {
        showMessage("Login failed.");
      }
    });
}

// 🔄 Load Tasks
window.onload = function () {
  const user = localStorage.getItem("username");
  const userLabel = document.getElementById("userLabel");
  if (userLabel) userLabel.innerText = user;

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const list = document.getElementById("taskList");
  if (list) {
    list.innerHTML = "";
    tasks.forEach(task => appendTask(task));
  }

  // Dark mode
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

// ➕ Add Task
function addTask() {
  const work = document.getElementById("taskInput").value;
  const user = localStorage.getItem("username");

  if (!work) return alert("Task cannot be empty.");

  fetch(`${backendURL}/AddTask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: user, work })
  })
    .then(res => res.text())
    .then(msg => {
      appendTask(work);
      document.getElementById("taskInput").value = "";
    });
}

function appendTask(work) {
  const list = document.getElementById("taskList");
  const li = document.createElement("li");
  li.innerHTML = `${work} <button onclick="removeTask('${work}')">🗑️</button>`;
  list.appendChild(li);
}

// 🗑️ Remove Task
function removeTask(work) {
  const user = localStorage.getItem("username");
  fetch(`${backendURL}/deleteWork`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: user, work })
  })
    .then(res => res.text())
    .then(msg => {
      location.reload();
    });
}

// 🌙 Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}
