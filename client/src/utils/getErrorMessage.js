export const getErrorMessage = (error, fallback = "something went wrong") => {
  return error.responce?.data?.message || fallback;
};
