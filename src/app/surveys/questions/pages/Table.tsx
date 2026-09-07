import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createQuestionsColumns } from "./questions.columns";
import type { QuestionsTableProps } from "../type/questions";

const QuestionsTable: Component<QuestionsTableProps> = (props) => {
  const columns = createQuestionsColumns(props);

  return (
    <DataTable
      rows={props.questions}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="Belum ada data pertanyaan."
      itemsPerPage={10}
    />
  );
};

export default QuestionsTable;
