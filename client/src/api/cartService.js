import api from "./axiosInstance";

export const cartService = {
  getCart: () => api.get("/cart"),

  addToCart: ({ productId, quantity, size, color }) =>
    api.post("/cart/add", { productId, quantity, size, color }),

  removeFromCart: (productId, size, color) =>
    api.delete(
      `/cart/remove/${productId}?size=${size || ""}&color=${color || ""}`,
    ),

  updateQuantity: ({ productId, quantity, size, color }) =>
    api.put(`/cart/update/${productId}`, { quantity, size, color }),

  clearCart: () => api.delete("/cart/clear"),
};
