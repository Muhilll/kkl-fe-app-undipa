import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createMahasiswaColumns } from "./mahasiswa.columns";
import type { MahasiswaTableProps } from "../type/mahasiswa-props";

const MahasiswaTable: Component<MahasiswaTableProps> = (props) => {
  const columns = createMahasiswaColumns(props);

  return (
    <DataTable
      rows={props.mahasiswas}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No mahasiswas found."
      itemsPerPage={10}
    />
  );
};

export default MahasiswaTable;
