import { api } from "../../../services/api";
import type { CreateLaporanInput, Laporan, UpdateLaporanInput } from "../type/laporan";

export const laporanAPI = {
  getAll: () => api.get<Laporan[]>("/laporans"),
  getById: (id: string) => api.get<Laporan>(`/laporans/${id}`),
  create: (data: CreateLaporanInput) => api.post<Laporan>("/laporans", data),
  update: (id: string, data: UpdateLaporanInput) =>
    api.put<Laporan>(`/laporans/${id}`, data),
  delete: (id: string) => api.delete<void>(`/laporans/${id}`),
};
