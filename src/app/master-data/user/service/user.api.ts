import { api } from "../../../../services/api";
import type { CreateUserInput, UpdateUserInput, User } from "../type/user";

export const userAPI = {
  getAll: () => api.get<User[]>("/users"),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (data: CreateUserInput) => api.post<User>("/users", data),
  update: (id: string, data: UpdateUserInput) =>
    api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};
