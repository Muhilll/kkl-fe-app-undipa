import { api } from "../../../../services/api";
import type { CreateDosenInput, Dosen, UpdateDosenInput } from "../type/dosen";

export const dosenAPI = {
  getAll: () => api.get<Dosen[]>("/dosens"),
  getById: (id: string) => api.get<Dosen>(`/dosens/${id}`),
  create: (data: CreateDosenInput) => api.post<Dosen>("/dosens", data),
  update: (id: string, data: UpdateDosenInput) =>
    api.put<Dosen>(`/dosens/${id}`, data),
  delete: (id: string) => api.delete<void>(`/dosens/${id}`),
};
