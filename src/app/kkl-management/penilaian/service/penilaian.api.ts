import { api } from "../../../../services/api";
import type { Penilaian, CreatePenilaianInput, UpdatePenilaianInput } from "../type/penilaian";

export const penilaianApi = {
  getAll: () => api.get<Penilaian[]>("/penilaians"),
  getById: (id: number) => api.get<Penilaian>(`/penilaians/${id}`),
  create: (data: CreatePenilaianInput) => api.post<Penilaian>("/penilaians", data),
  update: (id: number, data: UpdatePenilaianInput) => api.put<Penilaian>(`/penilaians/${id}`, data),
  delete: (id: number) => api.delete<void>(`/penilaians/${id}`),
};
