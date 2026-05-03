import { Component } from "solid-js";
import DataTable from "../../../components/ui/DataTable";
import { createKklKlpColumns } from "./kkl-klp.columns";
import type { KklKlpTableProps } from "../type/kkl-klp-props";

const KklKlpTable: Component<KklKlpTableProps> = (props) => {
  const columns = createKklKlpColumns(props);

  return (
    <DataTable
      rows={props.klps}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No KKL Kelompok found."
      itemsPerPage={10}
    />
  );
};

export default KklKlpTable;
