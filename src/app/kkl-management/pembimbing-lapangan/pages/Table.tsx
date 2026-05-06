import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createPembimbingLapanganColumns } from "./pembimbing-lapangan.columns";
import type { PembimbingLapanganTableProps } from "../type/pembimbing-lapangan-props";

const PembimbingLapanganTable: Component<PembimbingLapanganTableProps> = (props) => {
  const columns = createPembimbingLapanganColumns(props);
  return (
    <DataTable
      columns={columns}
      rows={props.pembimbingLapangans}
      isLoading={props.isLoading}
      emptyMessage="No pembimbing lapangan found."
    />
  );
};

export default PembimbingLapanganTable;
