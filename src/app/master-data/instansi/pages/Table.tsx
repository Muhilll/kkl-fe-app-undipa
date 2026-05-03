import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createInstansiColumns } from "./instansi.columns";
import type { InstansiTableProps } from "../type/instansi-props";

const InstansiTable: Component<InstansiTableProps> = (props) => {
  const columns = createInstansiColumns(props);

  return (
    <DataTable
      rows={props.instansis}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No instansi found."
      itemsPerPage={10}
    />
  );
};

export default InstansiTable;
