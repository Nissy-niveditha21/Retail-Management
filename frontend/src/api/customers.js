import api from "./axios";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};
