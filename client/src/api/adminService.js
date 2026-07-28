import api from "./axiosInstance";

export const adminService = {
  getAllOrders: () => {
    return api.get("/admin/orders");
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/admin/orders/${id}`, { status });
  },
  getAllUsers: () => {
    return api.get("/admin/users");
  },
  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },
  getDashboardStats: () => {
    return api.get("/admin/stats");
  },
};
