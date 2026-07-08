import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("manzio_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session
      localStorage.removeItem("manzio_token");
      localStorage.removeItem("manzio_user");
      // Reload to trigger the login screen
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;