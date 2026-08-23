const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Only set Content-Type to JSON if it's not FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    throw new Error(data.message || "An error occurred");
  }

  return data.data || data; // Return data or the raw response if data.data is undefined
}

export const api = {
  get: (url: string) => fetchWithAuth(url, { method: "GET" }),
  post: (url: string, body: any) => fetchWithAuth(url, { method: "POST", body: JSON.stringify(body) }),
  postForm: (url: string, formData: FormData) => fetchWithAuth(url, { method: "POST", body: formData }),
  put: (url: string, body: any) => fetchWithAuth(url, { method: "PUT", body: JSON.stringify(body) }),
  delete: (url: string) => fetchWithAuth(url, { method: "DELETE" }),
};
