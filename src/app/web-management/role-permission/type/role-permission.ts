import type { Role } from "../../../master-data/role/type/role";
import type { Menu } from "../../menu/type/menu";

export interface RolePermission {
  id: number;
  role_id: number;
  menu_id: number;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
  created_at?: string;
  updated_at?: string;
  role?: Role | null;
  menu?: Menu | null;
}

export interface CreateRolePermissionInput {
  role_id: string | number;
  menu_id: string | number;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}

export interface UpdateRolePermissionInput {
  role_id?: string | number;
  menu_id?: string | number;
  can_read?: boolean;
  can_create?: boolean;
  can_update?: boolean;
  can_delete?: boolean;
  can_report?: boolean;
}

export interface RolePermissionFormData {
  role_id: string;
  menu_id: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}

export interface RolePermissionMatrixItem {
  id?: number;
  role_id: number;
  menu_id: number;
  menu_name: string;
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}
