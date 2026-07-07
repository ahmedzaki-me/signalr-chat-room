import { api } from "@/api/axios";

export const getMessages = async () => {
  const { data } = await api.get("/api/v1/messages?limit=50");

  return data;
};
