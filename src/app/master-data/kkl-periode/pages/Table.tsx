import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createKklPeriodeColumns } from "./kkl-periode.columns";
import type { KklPeriodeTableProps } from "../type/kkl-periode-props";

const KklPeriodeTable: Component<KklPeriodeTableProps> = (props) => {
  const columns = createKklPeriodeColumns(props);

  return (
    <DataTable
      rows={props.periodes}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No KKL periodes found."
      itemsPerPage={10}
    />
  );
};

export default KklPeriodeTable;
