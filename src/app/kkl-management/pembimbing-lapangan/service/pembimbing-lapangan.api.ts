import { api } from "../../../../services/api";
import type { PembimbingLapangan, CreatePembimbingLapanganInput, UpdatePembimbingLapanganInput } from "../type/pembimbing-lapangan";

export const pembimbingLapanganAPI = {
  getAll: () => api.get<PembimbingLapangan[]>("/pembimbings"),
  getById: (id: string) => api.get<PembimbingLapangan>(`/pembimbings/${id}`),
  create: (data: CreatePembimbingLapanganInput) => api.post<PembimbingLapangan>("/pembimbings", data),
  update: (id: string, data: UpdatePembimbingLapanganInput) => api.put<PembimbingLapangan>(`/pembimbings/${id}`, data),
  delete: (id: string) => api.delete<void>(`/pembimbings/${id}`),
};
