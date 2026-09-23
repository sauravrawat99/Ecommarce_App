import api from "./axiosInstance";

export const addressService = {
  createAddress: (addressData) => {
    return api.post("/address", addressData);
  },

  getUserAddresses: () => {
    return api.get("/address");
  },

  setDefaultAddress: (id) => {
    return api.put(`/address/${id}/set-default`);
  },

  deleteAddress: (id) => {
    return api.delete(`/address/${id}`);
  },
};