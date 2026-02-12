async function handleAuth(action) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
  const password = passwordInput ? passwordInput.value : "";

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const result = await action(email, password);
    if (!result || !result.ok) {
      alert(result && result.message ? result.message : "Request failed.");
      return;
    }

    alert(result.message || "Success");
    if (action === window.auth.loginUser) {
      window.location.href = "index.html";
    } else {
      window.location.href = "login.html";
    }
  } catch (err) {
    alert("Request failed.");
  }
}

function register() {
  if (!window.auth || !window.auth.registerUser) {
    alert("Auth service unavailable.");
    return;
  }
  handleAuth(window.auth.registerUser);
}

function login() {
  if (!window.auth || !window.auth.loginUser) {
    alert("Auth service unavailable.");
    return;
  }
  handleAuth(window.auth.loginUser);
}
