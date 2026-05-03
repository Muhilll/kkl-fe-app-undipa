import { api } from "../../../../services/api";
import type { CreateInstansiInput, Instansi, UpdateInstansiInput } from "../type/instansi";

export const instansiAPI = {
  getAll: () => api.get<Instansi[]>("/instansis"),
  getById: (id: string) => api.get<Instansi>(`/instansis/${id}`),
  create: (data: CreateInstansiInput) => api.post<Instansi>("/instansis", data),
  update: (id: string, data: UpdateInstansiInput) =>
    api.put<Instansi>(`/instansis/${id}`, data),
  delete: (id: string) => api.delete<void>(`/instansis/${id}`),
};
