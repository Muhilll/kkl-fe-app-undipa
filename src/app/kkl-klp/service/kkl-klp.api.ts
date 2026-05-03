import { api } from "../../../services/api";
import type { CreateKklKlpInput, KklKlp, UpdateKklKlpInput } from "../type/kkl-klp";

export const kklKlpAPI = {
  getAll: () => api.get<KklKlp[]>("/kkl-klps"),
  getById: (id: string) => api.get<KklKlp>(`/kkl-klps/${id}`),
  create: (data: CreateKklKlpInput) => api.post<KklKlp>("/kkl-klps", data),
  update: (id: string, data: UpdateKklKlpInput) =>
    api.put<KklKlp>(`/kkl-klps/${id}`, data),
  delete: (id: string) => api.delete<void>(`/kkl-klps/${id}`),
};
