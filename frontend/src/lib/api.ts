const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let cachedToken: string | null = localStorage.getItem("demo_token");
let authPromise: Promise<string> | null = null;

async function getDemoToken() {
  if (cachedToken) return cachedToken;
  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@skillbridge.com", password: "password123" })
      });
      const data = await res.json();
      if (data.data?.tokens?.access?.token) {
        cachedToken = data.data.tokens.access.token;
        localStorage.setItem("demo_token", cachedToken as string);
        return cachedToken as string;
      }
      return "";
    } catch (e) {
      console.error("Auto-login failed", e);
      return "";
    }
  })();

  return authPromise;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getDemoToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data.data; // Assuming backend wraps response in { success, message, data }
}

export const api = {
  get: (url: string) => fetchWithAuth(url, { method: "GET" }),
  post: (url: string, body: any) => fetchWithAuth(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: any) => fetchWithAuth(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) => fetchWithAuth(url, { method: "DELETE" }),
};
