import { api } from "./api";
import type { Role } from "../app/master-data/role/type/role";
import type { Menu } from "../app/web-management/menu/type/menu";
import type { Jurusan } from "../app/master-data/jurusan/type/jurusan";
import type { User } from "../app/master-data/user/type/user";

export const lookupAPI = {
  getMenus: () => api.get<Menu[]>("/menus"),
  getRoles: () => api.get<Role[]>("/roles"),
  getJurusans: () => api.get<Jurusan[]>("/jurusans"),
  getUsers: () => api.get<User[]>("/users"),
};
