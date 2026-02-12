const fs = require("fs");
const bcrypt = require("bcrypt");
const path = require("path");

const usersPath = path.join(__dirname, "users.json");

function readUsers() {
  try {
    if (!fs.existsSync(usersPath)) {
      fs.writeFileSync(usersPath, "[]", "utf8");
      return [];
    }

    const raw = fs.readFileSync(usersPath, "utf8").trim();
    if (!raw) {
      fs.writeFileSync(usersPath, "[]", "utf8");
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      fs.writeFileSync(usersPath, "[]", "utf8");
      return [];
    }

    return parsed;
  } catch {
    fs.writeFileSync(usersPath, "[]", "utf8");
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf8");
}

function getCredentials() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const password = passwordInput ? passwordInput.value : "";

  return { email, password };
}

function register() {
  const { email, password } = getCredentials();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    alert("User already exists");
    return;
  }

  const hashed = bcrypt.hashSync(password, 10);
  users.push({ email, password: hashed });
  saveUsers(users);

  alert("Registered successfully");
  window.location.href = "login.html";
}

function login() {
  const { email, password } = getCredentials();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    alert("User not found");
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    alert("Login successful");
    window.location.href = "index.html";
  } else {
    alert("Wrong password");
  }
}
