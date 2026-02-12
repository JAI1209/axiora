const API_BASE_URL = window.appConfig ? window.appConfig.apiBaseUrl : "http://localhost:5000";

async function getAuthHeader() {
  const token = await window.secureStore.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, { method = "GET", body = null, auth = false, retry = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    Object.assign(headers, await getAuthHeader());
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (auth && response.status === 401 && retry && window.authService && window.authService.refreshToken) {
      const refreshed = await window.authService.refreshToken();
      if (refreshed) {
        return apiRequest(path, { method, body, auth, retry: false });
      }
    }
    return {
      ok: false,
      status: response.status,
      message: payload && payload.message ? payload.message : "Request failed.",
    };
  }

  return payload || { ok: true };
}

window.apiService = { apiRequest };
