import { api } from "../../../../services/api";
import type { CreateJurusanInput, Jurusan, UpdateJurusanInput } from "../type/jurusan";

export const jurusanAPI = {
  getAll: () => api.get<Jurusan[]>("/jurusans"),
  getById: (id: string) => api.get<Jurusan>(`/jurusans/${id}`),
  create: (data: CreateJurusanInput) => api.post<Jurusan>("/jurusans", data),
  update: (id: string, data: UpdateJurusanInput) =>
    api.put<Jurusan>(`/jurusans/${id}`, data),
  delete: (id: string) => api.delete<void>(`/jurusans/${id}`),
};
