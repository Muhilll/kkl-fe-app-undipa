import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createMenuColumns } from "./menu.columns";
import type { MenuTableProps } from "../type/menu-props";

const MenuTable: Component<MenuTableProps> = (props) => {
  const columns = createMenuColumns(props);

  return (
    <DataTable
      rows={props.menus}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No menus found."
      itemsPerPage={10}
    />
  );
};

export default MenuTable;
