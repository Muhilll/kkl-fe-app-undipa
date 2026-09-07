import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createSubmissionsColumns } from "./submissions.columns";
import type { SubmissionsTableProps } from "../type/submissions";

const SubmissionsTable: Component<SubmissionsTableProps> = (props) => {
  const columns = createSubmissionsColumns(props);

  return (
    <DataTable
      rows={props.submissions}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="Belum ada data respons kuesioner."
      itemsPerPage={10}
    />
  );
};

export default SubmissionsTable;
