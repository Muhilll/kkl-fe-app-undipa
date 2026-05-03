import { Component } from "solid-js";
import DataTable from "../../../components/ui/DataTable";
import { createKklAgtColumns } from "./kkl-agt.columns";
import type { KklAgtTableProps } from "../type/kkl-agt-props";

const KklAgtTable: Component<KklAgtTableProps> = (props) => {
  const columns = createKklAgtColumns(props);

  return (
    <DataTable
      rows={props.agts}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No KKL Anggota found."
      itemsPerPage={10}
    />
  );
};

export default KklAgtTable;
