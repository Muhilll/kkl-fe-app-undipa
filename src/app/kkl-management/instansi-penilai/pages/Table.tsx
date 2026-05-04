import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createInstansiPenilaiColumns } from "./instansi-penilai.columns";
import type { InstansiPenilaiTableProps } from "../type/instansi-penilai-props";

const InstansiPenilaiTable: Component<InstansiPenilaiTableProps> = (props) => {
  const columns = createInstansiPenilaiColumns(props);
  return (
    <DataTable
      columns={columns}
      rows={props.instansiPenilais}
      isLoading={props.isLoading}
      emptyMessage="No instansi penilais found."
    />
  );
};

export default InstansiPenilaiTable;
