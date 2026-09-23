import api from "./axiosInstance";

export const orderService = {
  createOrder: (shippingAddress, paymentMethod) => {
    return api.post("/account/orders/create/order", {
      shippingAddress,
      paymentMethod,
    });
  },

  myOrders: () => {
    return api.get("/account/orders/my-orders"); // ✅ fixed
  },

  singleOrder: (id) => {
    return api.get(`/account/orders/${id}`); // ✅ fixed
  },

  cancelOrder: (id) => {
    return api.put(`/account/orders/cancel/${id}`); // ✅ PUT, sahi path
  },

  updateOrderStatus: (id, status) => {
    return api.put(`/account/orders/status/${id}`, { status }); // ✅ fixed
  },
};