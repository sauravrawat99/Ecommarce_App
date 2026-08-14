import api from "./axiosInstance";

api;
export const collectionService = {
  getAllCollection: () => {
    return api.get("/collections");
  },

  getBySlug: (slug) => {
    return api.get(`/collections/${slug}`);
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
