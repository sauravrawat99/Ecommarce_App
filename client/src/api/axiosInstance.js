import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://ecommarce-app-1.onrender.com",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor — errors handle karo
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expire — localStorage clear karo
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
