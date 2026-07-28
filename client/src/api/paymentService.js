import api from "./axiosInstance";

export const paymentService = {
  createPayment: (orderId) => {
    return api.post("/create", { orderId });
  },

  verifyPayment: (paymentData) => {
    return api.post("/verify", paymentData);
  },
};
