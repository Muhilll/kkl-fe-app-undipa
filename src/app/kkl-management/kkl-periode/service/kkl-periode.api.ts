import { api } from "../../../../services/api";
import type { CreateKklPeriodeInput, KklPeriode, UpdateKklPeriodeInput } from "../type/kkl-periode";

export const kklPeriodeAPI = {
  getAll: () => api.get<KklPeriode[]>("/kkl-periodes"),
  getById: (id: string) => api.get<KklPeriode>(`/kkl-periodes/${id}`),
  create: (data: CreateKklPeriodeInput) => api.post<KklPeriode>("/kkl-periodes", data),
  update: (id: string, data: UpdateKklPeriodeInput) =>
    api.put<KklPeriode>(`/kkl-periodes/${id}`, data),
  activate: (id: string) =>
    api.put<KklPeriode>(`/kkl-periodes/${id}/activate`, {}),
  delete: (id: string) => api.delete<void>(`/kkl-periodes/${id}`),
};
