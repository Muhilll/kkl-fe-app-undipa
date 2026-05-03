import { api } from "../../../../services/api";
import type { CreateMahasiswaInput, Mahasiswa, UpdateMahasiswaInput } from "../type/mahasiswa";

export const mahasiswaAPI = {
  getAll: () => api.get<Mahasiswa[]>("/mahasiswas"),
  getById: (id: string) => api.get<Mahasiswa>(`/mahasiswas/${id}`),
  create: (data: CreateMahasiswaInput) => api.post<Mahasiswa>("/mahasiswas", data),
  update: (id: string, data: UpdateMahasiswaInput) =>
    api.put<Mahasiswa>(`/mahasiswas/${id}`, data),
  delete: (id: string) => api.delete<void>(`/mahasiswas/${id}`),
};
