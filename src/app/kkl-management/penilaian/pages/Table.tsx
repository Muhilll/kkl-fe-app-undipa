import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createPenilaianColumns } from "./penilaian.columns";
import type { PenilaianTableProps } from "../type/penilaian-props";

const PenilaianTable: Component<PenilaianTableProps> = (props) => {
  const columns = createPenilaianColumns(props);

  return (
    <DataTable
      rows={props.penilaians}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No Penilaian found."
      itemsPerPage={10}
    />
  );
};

export default PenilaianTable;
