import api from "././axiosInstance";
export const authService = {
  register: (userData) => {
    return api.post("/auth/register", userData); // ← return
  },

  login: (credentials) => {
    return api.post("/auth/login", credentials); // ← return
  },

  logout: () => {
    return api.get("/auth/logout"); // ← GET nahi, POST hai tera backend me
  },

  getProfile: () => {
    return api.get("/auth/me"); // ← return
  },

  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email }); // ← return
  },

  resetPassword: (data) => {
    return api.post("/auth/reset-password", data); // ← return
  },
};
