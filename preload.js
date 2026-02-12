const { contextBridge } = require("electron");

const API_BASE_URL = "http://localhost:5000";

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return {
      ok: false,
      message: payload && payload.message ? payload.message : "Request failed.",
    };
  }

  return payload || { ok: true, message: "Success" };
}

contextBridge.exposeInMainWorld("auth", {
  registerUser: (email, password) => postJson("/api/register", { email, password }),
  loginUser: (email, password) => postJson("/api/login", { email, password }),
});
