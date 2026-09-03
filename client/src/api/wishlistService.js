import api from "./axiosInstance";

export const wishlistService = {
  getWishlist: () => {
    return api.get("/wishlist");
  },

  addToWishlist: (productId) => {
    return api.post("wishlist/add", { productId });
  },

  removeFromWishlist: (productId) => {
    return api.delete(`/wishlist/${productId}`);
  },
};
