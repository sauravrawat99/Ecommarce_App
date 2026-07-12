import api from "./axiosInstance";

export const categoryService = {
  createCategory: (categoryData) => {
    return api.post("/category", categoryData);
  },
  getCategories: () => {
    return api.get("/category");
  },
  getCategoryById: (id) => {
    return api.get(`/category/${id}`);
  },
  updateCategory: (id, categoryData) => {
    return api.put(`/category/${id}`, categoryData);
  },
  deleteCategory: (id) => {
    return api.delete(`/category/${id}`);
  },
};
