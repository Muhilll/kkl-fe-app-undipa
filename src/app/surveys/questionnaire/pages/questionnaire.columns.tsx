import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { Questionnaire, QuestionnaireTableProps } from "../type/questionnaire";

const IconHelpCircle = () => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconFileText = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
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

export const createQuestionnaireColumns = (
  props: Pick<
    QuestionnaireTableProps,
    | "onEdit"
    | "onDelete"
    | "onManageQuestions"
    | "onManageSubmissions"
    | "canUpdate"
    | "canDelete"
  >,
): DataTableColumn<Questionnaire>[] => [
  {
    header: "No",
    cell: (_, index) => <>{index + 1}</>,
    sortValue: (p) => p.id,
  },
  {
    header: "Nama Kuesioner",
    cell: (p) => <span style={{ "font-weight": "500" }}>{p.name}</span>,
    sortValue: (p) => p.name,
  },
  {
    header: "Deskripsi",
    cell: (p) => (
      <span style={{ color: "var(--gray-600)" }}>
        {p.desc.length > 70 ? `${p.desc.substring(0, 70)}...` : p.desc}
      </span>
    ),
    sortValue: (p) => p.desc,
  },
  {
    header: "Pertanyaan",
    cell: (p) => (
      <span
        style={{
          padding: "3px 8px",
          "background-color": "var(--blue-50, #eff6ff)",
          color: "var(--blue-700, #1d4ed8)",
          "border-radius": "12px",
          "font-size": "12px",
          "font-weight": "500",
        }}
      >
        {p.total_questions || 0} Soal
      </span>
    ),
    sortValue: (p) => p.total_questions || 0,
  },
  {
    header: "Responden",
    cell: (p) => (
      <span
        style={{
          padding: "3px 8px",
          "background-color": "var(--emerald-50, #ecfdf5)",
          color: "var(--emerald-700, #047857)",
          "border-radius": "12px",
          "font-size": "12px",
          "font-weight": "500",
        }}
      >
        {p.total_respondents || 0} Mahasiswa
      </span>
    ),
    sortValue: (p) => p.total_respondents || 0,
  },
  {
    header: "Actions",
    sortable: false,
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (p) => (
      <div class="action-btns">
        <button
          class="btn-icon"
          style={{ color: "var(--indigo-600, #4f46e5)" }}
          title="Lihat & Kelola Daftar Pertanyaan"
          onClick={() => props.onManageQuestions(p)}
        >
          <IconHelpCircle />
        </button>
        <button
          class="btn-icon"
          style={{ color: "var(--emerald-600, #059669)" }}
          title="Lihat Mahasiswa yang Mengirim Jawaban"
          onClick={() => props.onManageSubmissions(p)}
        >
          <IconFileText />
        </button>
        {props.canUpdate && (
          <button
            class="btn-icon btn-edit"
            title="Edit Kuesioner"
            onClick={() => props.onEdit(p)}
          >
            <IconEdit />
          </button>
        )}
        {props.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Hapus Kuesioner"
            onClick={() => props.onDelete(String(p.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];
