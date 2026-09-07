import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { Submission, SubmissionsTableProps } from "../type/submissions";

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

export const createSubmissionsColumns = (
  props: Pick<
    SubmissionsTableProps,
    "onEdit" | "onDelete" | "canUpdate" | "canDelete" | "hideMahasiswaCol" | "hideQuestionCol"
  >,
): DataTableColumn<Submission>[] => [
  {
    header: "No",
    cell: (_, index) => <>{index + 1}</>,
    sortValue: (s) => s.id,
  },
  ...(!props.hideMahasiswaCol
    ? [
        {
          header: "Mahasiswa",
          cell: (s: Submission) => (
            <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
              <span style={{ "font-weight": "500" }}>{s.mahasiswa_nama}</span>
              <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
                NIM: {s.mahasiswa_nim}
              </span>
            </div>
          ),
          sortValue: (s: Submission) => s.mahasiswa_nama || "",
        },
      ]
    : []),
  {
    header: "Kuesioner",
    cell: (s: Submission) => (
      <span style={{ "font-weight": "500", color: "var(--indigo-600)" }}>
        {s.questionnaire_name || "-"}
      </span>
    ),
    sortValue: (s: Submission) => s.questionnaire_name || "",
  },
  ...(!props.hideQuestionCol
    ? [
        {
          header: "Pertanyaan",
          cell: (s: Submission) => (
            <span style={{ color: "var(--gray-700)" }}>
              {s.question && s.question.length > 60
                ? `${s.question.substring(0, 60)}...`
                : s.question || `Soal #${s.question_id}`}
            </span>
          ),
          sortValue: (s: Submission) => s.question || "",
        },
      ]
    : []),
  {
    header: "Skor Jawaban",
    cell: (s: Submission) => (
      <span
        style={{
          padding: "3px 8px",
          "background-color": "var(--emerald-50, #ecfdf5)",
          color: "var(--emerald-700, #047857)",
          "border-radius": "10px",
          "font-size": "12px",
          "font-weight": "600",
        }}
      >
        Nilai: {s.score}
      </span>
    ),
    sortValue: (s: Submission) => s.score,
  },
  {
    header: "Tanggal",
    cell: (s: Submission) => (
      <span style={{ "font-size": "12px", color: "var(--gray-600)" }}>
        {new Date(s.created_at).toLocaleString("id-ID")}
      </span>
    ),
    sortValue: (s: Submission) => s.created_at,
  },
  {
    header: "Actions",
    sortable: false,
    headerStyle: { "text-align": "right" as const },
    cellClass: "td-actions",
    cell: (s: Submission) => (
      <div class="action-btns">
        {props.canUpdate && (
          <button
            class="btn-icon btn-edit"
            title="Edit Jawaban"
            onClick={() => props.onEdit(s)}
          >
            <IconEdit />
          </button>
        )}
        {props.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Hapus Jawaban"
            onClick={() => props.onDelete(String(s.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];
