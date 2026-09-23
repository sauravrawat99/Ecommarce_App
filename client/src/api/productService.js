import api from "./axiosInstance";

export const productsService = {
  createProduct: (productData) => {
    return api.post("/product", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProducts: () => {
    return api.get("/product");
  },
  getProductById: (id) => {
    return api.get(`/product/${id}`);
  },
  updateProduct: (id, productData) => {
    return api.put(`/product/${id}`, productData);
  },
  deleteProduct: (id) => {
    return api.delete(`/product/${id}`);
  },
  getSearch: (queryParams) => {
    return api.get(`/product/search/${queryParams}`);
  },
};
