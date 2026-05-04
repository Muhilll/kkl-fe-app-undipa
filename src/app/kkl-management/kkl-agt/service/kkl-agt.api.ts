import { api } from "../../../../services/api";
import type { CreateKklAgtInput, KklAgt, UpdateKklAgtInput } from "../type/kkl-agt";

export const kklAgtAPI = {
  getAll: () => api.get<KklAgt[]>("/kkl-agts"),
  getById: (id: string) => api.get<KklAgt>(`/kkl-agts/${id}`),
  create: (data: CreateKklAgtInput) => api.post<KklAgt>("/kkl-agts", data),
  update: (id: string, data: UpdateKklAgtInput) =>
    api.put<KklAgt>(`/kkl-agts/${id}`, data),
  delete: (id: string) => api.delete<void>(`/kkl-agts/${id}`),
};
