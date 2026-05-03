import { api } from "./api";
import type { Role } from "../app/master-data/role/type/role";
import type { Menu } from "../app/web-management/menu/type/menu";

export const lookupAPI = {
  getMenus: () => api.get<Menu[]>("/menus"),
  getRoles: () => api.get<Role[]>("/roles"),
};
