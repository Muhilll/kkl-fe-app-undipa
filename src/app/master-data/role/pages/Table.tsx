import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createRoleColumns } from "./role.columns";
import type { RoleTableProps } from "../type/role-props";

const RoleTable: Component<RoleTableProps> = (props) => {
  const columns = createRoleColumns(props);

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

export default RoleTable;
