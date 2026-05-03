import type {
  RolePermissionMatrixItem,
  RolePermission,
} from "./role-permission";
import type { Role } from "../../../master-data/role/type/role";

export interface RolePermissionTableProps {
  roles: Role[];
  isLoading: boolean;
  rolePermissions: RolePermission[];
  canUpdate?: boolean;
  onManagePermissions: (role: Role) => void;
}

export interface RolePermissionFormProps {
  role?: Role | null;
  items: RolePermissionMatrixItem[];
  onSubmit: (items: RolePermissionMatrixItem[]) => void;
  isLoading?: boolean;
}
