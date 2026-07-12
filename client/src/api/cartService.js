import api from "./axiosInstance";

export const cartService = {
  addToCart: (productId, quantity) => {
    return api.post("/cart/add", { productId, quantity }); // ✅ ek object!
  },

  getCart: () => {
    return api.get("/cart"); // ✅ slash add kiya
  },

  removeFromCart: (productId) => {
    return api.delete(`/cart/remove/${productId}`);
  },

  updateQuantity: (productId, quantity) => {
    return api.put(`/cart/update/${productId}`, { quantity });
  },

  clearCart: () => {
    return api.delete("/cart/clear");
  },
};
