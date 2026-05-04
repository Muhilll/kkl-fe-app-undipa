import { api } from "../../../../services/api";
import type { InstansiPenilai, CreateInstansiPenilaiInput, UpdateInstansiPenilaiInput } from "../type/instansi-penilai";

export const instansiPenilaiAPI = {
  getAll: () => api.get<InstansiPenilai[]>("/instansi-penilais"),
  getById: (id: string) => api.get<InstansiPenilai>(`/instansi-penilais/${id}`),
  create: (data: CreateInstansiPenilaiInput) => api.post<InstansiPenilai>("/instansi-penilais", data),
  update: (id: string, data: UpdateInstansiPenilaiInput) => api.put<InstansiPenilai>(`/instansi-penilais/${id}`, data),
  delete: (id: string) => api.delete<void>(`/instansi-penilais/${id}`),
};
