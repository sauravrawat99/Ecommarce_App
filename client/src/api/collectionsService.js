import api from "./axiosInstance";

export const collectionService = {
  getAllCollection: () => {
    return api.get("/collections");
  },

  getBySlug: (slug, queryParams) => {
    return api.get(`/collections/${slug}`, { params: queryParams });
  },

  createCollection: (bodyData) => {
    return api.post("/collections", bodyData);
  },

  updateCollection: (id, bodyData) => {
    return api.put(`/collections/${id}`, bodyData);
  },

  deleteCollection: (id) => {
    return api.delete(`/collections/${id}`);
  },
};
