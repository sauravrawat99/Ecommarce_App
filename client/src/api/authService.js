import api from "././axiosInstance";
export const authService = {
  register: (userData) => {
    return api.post("/account/register", userData); // ← return
  },

  login: (credentials) => {
    return api.post("/account/login", credentials); // ← return
  },

  logout: () => {
    return api.post("/account/logout"); // ← GET nahi, POST hai tera backend me
  },

  getProfile: () => {
    return api.get("/account/me"); // ← return
  },

  forgotPassword: (email) => {
    return api.post("/account/forgot-password", { email }); // ← return
  },

  resetPassword: (data) => {
    return api.post("/account/reset-password", data); // ← return
  },
};
