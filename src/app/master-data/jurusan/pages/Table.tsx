import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createJurusanColumns } from "./jurusan.columns";
import type { JurusanTableProps } from "../type/jurusan-props";

const JurusanTable: Component<JurusanTableProps> = (props) => {
  const columns = createJurusanColumns(props);

  return (
    <DataTable
      rows={props.jurusans}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No jurusans found."
      itemsPerPage={10}
    />
  );
};

export default JurusanTable;
