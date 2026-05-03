import { api } from "../../../../services/api";
import type {
  CreateRolePermissionInput,
  RolePermission,
  UpdateRolePermissionInput,
} from "../type/role-permission";

export const rolePermissionAPI = {
  getAll: () => api.get<RolePermission[]>("/role-permissions"),
  getById: (id: string) => api.get<RolePermission>(`/role-permissions/${id}`),
  create: (data: CreateRolePermissionInput) =>
    api.post<RolePermission>("/role-permissions", data),
  update: (id: string, data: UpdateRolePermissionInput) =>
    api.put<RolePermission>(`/role-permissions/${id}`, data),
  delete: (id: string) => api.delete<void>(`/role-permissions/${id}`),
};
