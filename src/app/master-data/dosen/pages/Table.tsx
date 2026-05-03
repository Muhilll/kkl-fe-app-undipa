import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createDosenColumns } from "./dosen.columns";
import type { DosenTableProps } from "../type/dosen-props";

const DosenTable: Component<DosenTableProps> = (props) => {
  const columns = createDosenColumns(props);

  return (
    <DataTable
      rows={props.dosens}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No dosens found."
      itemsPerPage={10}
    />
  );
};

export default DosenTable;
