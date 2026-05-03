import { api } from "../../../../services/api";
import type { CreateMenuInput, Menu, UpdateMenuInput } from "../type/menu";

export const menuAPI = {
  getAll: () => api.get<Menu[]>("/menus"),
  getById: (id: string) => api.get<Menu>(`/menus/${id}`),
  create: (data: CreateMenuInput) => api.post<Menu>("/menus", data),
  update: (id: string, data: UpdateMenuInput) =>
    api.put<Menu>(`/menus/${id}`, data),
  delete: (id: string) => api.delete<void>(`/menus/${id}`),
};
