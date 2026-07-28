import api from "./axiosInstance";

export const orderService = {
  createOrder: (shippingAddress, paymentMethod) => {
    return api.post("/create/order", { shippingAddress, paymentMethod });
  },

  myOrders: () => {
    return api.get("/my-order");
  },

  singleOrder: (id) => {
    return api.get(`/${id}`);
  },

  cancelOrder: (id) => {
    return api.delete(`/delete/${id}`);
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/status/${id}`, { status });
  },
};
