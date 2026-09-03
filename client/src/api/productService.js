import api from "./axiosInstance";

export const productsService = {
  createProduct: (productData) => {
    return api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProducts: () => {
    return api.get("/products");
  },
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },
  getSearch: (queryParams) => {
    return api.get(`/product/search/${queryParams}`);
  },
};
