import { api } from "../../../../services/api";
import type { CreateRoleInput, Role, UpdateRoleInput } from "../type/role";

export const roleAPI = {
  getAll: () => api.get<Role[]>("/roles"),
  getById: (id: string) => api.get<Role>(`/roles/${id}`),
  create: (data: CreateRoleInput) => api.post<Role>("/roles", data),
  update: (id: string, data: UpdateRoleInput) =>
    api.put<Role>(`/roles/${id}`, data),
  delete: (id: string) => api.delete<void>(`/roles/${id}`),
};
