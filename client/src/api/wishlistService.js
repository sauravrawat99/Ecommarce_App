import api from "./axiosInstance";

export const wishlistService = {
  getWishlist: () => {
    return api.get("/");
  },

  addToWishlist: (productId) => {
    return api.post("/add", { productId });
  },

  removeFromWishlist: (productId) => {
    return api.delete(`/${productId}`);
  },
};
