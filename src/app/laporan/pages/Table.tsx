import { Component } from "solid-js";
import DataTable from "../../../components/ui/DataTable";
import { createLaporanColumns } from "./laporan.columns";
import type { LaporanTableProps } from "../type/laporan-props";

const LaporanTable: Component<LaporanTableProps> = (props) => {
  const columns = createLaporanColumns(props);

  return (
    <DataTable
      rows={props.laporans}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No Laporan found."
      itemsPerPage={10}
    />
  );
};

export default LaporanTable;
