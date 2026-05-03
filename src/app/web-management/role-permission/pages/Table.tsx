import type { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createRolePermissionColumns } from "./role-permission.columns";
import type { RolePermissionTableProps } from "../type/role-permission-props";

const RolePermissionTable: Component<RolePermissionTableProps> = (props) => {
  const columns = createRolePermissionColumns(props);

  return (
    <DataTable
      rows={props.roles}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No roles found."
      itemsPerPage={10}
    />
  );
};

export default RolePermissionTable;
