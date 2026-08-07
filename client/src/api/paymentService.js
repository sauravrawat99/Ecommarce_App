import api from "./axiosInstance";

export const paymentService = {
  createPayment: (orderId) => {
    return api.post("/payment/create", { orderId });
  },

  verifyPayment: (paymentData) => {
    return api.post("/payment/verify", paymentData);
  },
};
