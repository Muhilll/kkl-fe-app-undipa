import type { DataTableColumn } from "../../../components/ui/DataTable";
import type { KklAgtTableProps } from "../type/kkl-agt-props";
import type { KklAgt } from "../type/kkl-agt";

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

export const createKklAgtColumns = (
  props: Pick<KklAgtTableProps, "onEdit" | "onDelete" | "canUpdate" | "canDelete">,
): DataTableColumn<KklAgt>[] => [
    { header: "No", cell: (_, index) => <>{index + 1}</> },
    {
      header: "Mahasiswa", cell: (p) => <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
        <span style={{ "font-weight": "500" }}>{p.mahasiswa?.nama || "-"}</span>
        <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
          NIM: {p.mahasiswa?.nim || "-"}
        </span>
      </div>
    },
    { header: "Periode KKL", cell: (p) => <>{p.kkl_klp?.kkl_periode?.semester} - {p.kkl_klp?.kkl_periode?.tahun}</> },
    { header: "Instansi Tujuan", cell: (p) => <>{p.kkl_klp?.instansi?.nama}</> },
    {
      header: "Dosen Pembimbing", cell: (p) => <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
        <span style={{ "font-weight": "500" }}>{p.kkl_klp?.dosen?.nama || "-"}</span>
        <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
          NIP: {p.kkl_klp?.dosen?.nidn || "-"}
        </span>
      </div>
    },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (p) => (
        <div class="action-btns">
          {props.canUpdate && (
            <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(p)}>
              <IconEdit />
            </button>
          )}
          {props.canDelete && (
            <button
              class="btn-icon btn-delete"
              title="Delete"
              onClick={() => props.onDelete(String(p.id))}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ),
    },
  ];
