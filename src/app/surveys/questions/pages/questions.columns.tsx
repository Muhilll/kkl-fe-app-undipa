import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { Question, QuestionsTableProps } from "../type/questions";

const IconEye = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEdit = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const createQuestionsColumns = (
  props: Pick<
    QuestionsTableProps,
    | "onEdit"
    | "onDelete"
    | "onViewSubmissions"
    | "canUpdate"
    | "canDelete"
    | "hideQuestionnaireCol"
  >,
): DataTableColumn<Question>[] => [
  {
    header: "No",
    cell: (_, index) => <>{index + 1}</>,
    sortValue: (q) => q.id,
  },
  ...(!props.hideQuestionnaireCol
    ? [
        {
          header: "Kuesioner",
          cell: (q: Question) => (
            <span style={{ "font-weight": "500", color: "var(--indigo-600)" }}>
              {q.questionnaire_name || `Kuesioner #${q.questionnaire_id}`}
            </span>
          ),
          sortValue: (q: Question) => q.questionnaire_name || "",
        },
      ]
    : []),
  {
    header: "Pertanyaan",
    cell: (q) => <span style={{ "font-weight": "500" }}>{q.question}</span>,
    sortValue: (q) => q.question,
  },
  {
    header: "Opsi 1 s/d 5",
    cell: (q) => (
      <div style={{ "font-size": "12px", color: "var(--gray-600)" }}>
        <div>1. {q.options_one}</div>
        <div>2. {q.options_two}</div>
        <div>3. {q.options_three}</div>
        <div>4. {q.options_four}</div>
        <div>5. {q.options_five}</div>
      </div>
    ),
  },
  {
    header: "Bobot/Skor",
    cell: (q) => (
      <span
        style={{
          padding: "2px 8px",
          "background-color": "var(--purple-50, #faf5ff)",
          color: "var(--purple-700, #7e22ce)",
          "border-radius": "10px",
          "font-size": "12px",
          "font-weight": "600",
        }}
      >
        {q.score} Poin
      </span>
    ),
    sortValue: (q) => q.score,
  },
  {
    header: "Total Respons",
    cell: (q) => (
      <span
        style={{
          padding: "2px 8px",
          "background-color": "var(--blue-50, #eff6ff)",
          color: "var(--blue-700, #1d4ed8)",
          "border-radius": "10px",
          "font-size": "12px",
          "font-weight": "500",
        }}
      >
        {q.total_submissions || 0} Jawaban
      </span>
    ),
    sortValue: (q) => q.total_submissions || 0,
  },
  {
    header: "Actions",
    sortable: false,
    headerStyle: { "text-align": "right" as const },
    cellClass: "td-actions",
    cell: (q) => (
      <div class="action-btns">
        {props.onViewSubmissions && (
          <button
            class="btn-icon"
            style={{ color: "var(--blue-600, #2563eb)" }}
            title="Lihat Jawaban Mahasiswa"
            onClick={() => props.onViewSubmissions!(q)}
          >
            <IconEye />
          </button>
        )}
        {props.canUpdate && (
          <button
            class="btn-icon btn-edit"
            title="Edit Pertanyaan"
            onClick={() => props.onEdit(q)}
          >
            <IconEdit />
          </button>
        )}
        {props.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Hapus Pertanyaan"
            onClick={() => props.onDelete(String(q.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];
