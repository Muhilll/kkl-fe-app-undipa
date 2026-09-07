import { Component } from "solid-js";
import DataTable from "../../../../components/ui/DataTable";
import { createQuestionnaireColumns } from "./questionnaire.columns";
import type { QuestionnaireTableProps } from "../type/questionnaire";

const QuestionnaireTable: Component<QuestionnaireTableProps> = (props) => {
  const columns = createQuestionnaireColumns(props);

  return (
    <DataTable
      rows={props.questionnaires}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="Belum ada data kuesioner."
      itemsPerPage={10}
    />
  );
};

export default QuestionnaireTable;
