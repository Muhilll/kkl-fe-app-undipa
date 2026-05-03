import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createUserColumns } from "./user.columns";
import type { UserTableProps } from "../type/user-props";

const UserTable: Component<UserTableProps> = (props) => {
  const columns = createUserColumns(props);

  return (
    <DataTable
      rows={props.users}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No users found."
      itemsPerPage={10}
    />
  );
};

export default UserTable;
