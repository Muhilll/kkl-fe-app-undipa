import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { Role } from "../../../master-data/role/type/role";
import type { RolePermissionTableProps } from "../type/role-permission-props";
import type { RolePermission } from "../type/role-permission";

const IconShield = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const countConfiguredMenus = (roleId: number, rolePermissions: RolePermission[]) => {
  const menuIds = new Set(
    rolePermissions
      .filter((item) => item.role_id === roleId)
      .map((item) => item.menu_id),
  );

  return menuIds.size;
};

export const createRolePermissionColumns = (
  props: Pick<
    RolePermissionTableProps,
    "onManagePermissions" | "rolePermissions" | "canUpdate"
  >,
): DataTableColumn<Role>[] => [
  { header: "No", cell: (_, index) => <>{index + 1}</> },
  { header: "Role Name", cell: (role) => <>{role.name}</> },
  { header: "Role Code", cell: (role) => <>{role.code}</> },
  {
    header: "Menus Configured",
    cell: (role) => <>{countConfiguredMenus(role.id, props.rolePermissions)}</>,
  },
  {
    header: "Actions",
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (role) => (
      <div class="action-btns">
        {props.canUpdate && (
          <button
            class="btn-icon btn-edit"
            title="Permission"
            onClick={() => props.onManagePermissions(role)}
          >
            <IconShield />
          </button>
        )}
      </div>
    ),
  },
];
