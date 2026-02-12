async function registerUser(email, password) {
  return window.apiService.apiRequest("/api/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

async function loginUser(email, password) {
  const result = await window.apiService.apiRequest("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (result && result.ok && result.token && result.refreshToken) {
    await window.secureStore.setTokens(result.token, result.refreshToken);
  }

  return result;
}

async function refreshToken() {
  const refreshToken = await window.secureStore.getRefreshToken();
  if (!refreshToken) return false;

  const result = await window.apiService.apiRequest("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
    auth: false,
    retry: false,
  });

  if (result && result.ok && result.token && result.refreshToken) {
    await window.secureStore.setTokens(result.token, result.refreshToken);
    return true;
  }

  await window.secureStore.clearTokens();
  return false;
}

async function getProfile() {
  return window.apiService.apiRequest("/api/auth/profile", { auth: true });
}

async function autoLogin() {
  const accessToken = await window.secureStore.getAccessToken();
  const refreshTokenValue = await window.secureStore.getRefreshToken();
  if (!accessToken && !refreshTokenValue) return false;

  const profile = await getProfile();
  if (!profile || !profile.ok) {
    await window.secureStore.clearTokens();
    return false;
  }

  window.location.href = "index.html";
  return true;
}

async function requireAuth() {
  const accessToken = await window.secureStore.getAccessToken();
  const refreshTokenValue = await window.secureStore.getRefreshToken();
  if (!accessToken && !refreshTokenValue) {
    window.location.href = "login.html";
    return null;
  }

  const profile = await getProfile();
  if (!profile || !profile.ok) {
    await window.secureStore.clearTokens();
    window.location.href = "login.html";
    return null;
  }

  return profile.user;
}

async function logout() {
  await window.apiService.apiRequest("/api/auth/logout", { method: "POST", auth: true, retry: false });
  await window.secureStore.clearTokens();
  window.location.href = "login.html";
}

window.authService = {
  registerUser,
  loginUser,
  refreshToken,
  getProfile,
  autoLogin,
  requireAuth,
  logout,
};
