import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { InstansiTableProps } from "../type/instansi-props";
import type { Instansi } from "../type/instansi";

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

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
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

export const createInstansiColumns = (
  props: Pick<InstansiTableProps, "onEdit" | "onDelete" | "canUpdate" | "canDelete" | "onManagePenilai">,
): DataTableColumn<Instansi>[] => [
  { header: "No", cell: (_, index) => <>{index + 1}</> },
  { header: "Kode", cell: (i) => <>{i.kode}</> },
  { header: "Nama Instansi", cell: (i) => <>{i.nama}</> },
  { header: "Alamat", cell: (i) => <>{i.alamat}</> },
  { header: "Telp", cell: (i) => <>{i.telp || "-"}</> },
  {
    header: "Actions",
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (i) => (
      <div class="action-btns" style={{ display: "flex", gap: "8px", "justify-content": "flex-end" }}>
        {props.onManagePenilai && (
          <button
            class="btn-icon"
            title="Kelola Akun Penilai"
            onClick={() => props.onManagePenilai!(i.id)}
            style={{
              padding: "6px",
              "background-color": "var(--blue-50)",
              color: "var(--blue-600)",
              border: "1px solid var(--blue-200)",
              "border-radius": "6px",
              cursor: "pointer",
              display: "inline-flex"
            }}
          >
            <IconUser />
          </button>
        )}
        {props.canUpdate && (
          <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(i)}>
            <IconEdit />
          </button>
        )}
        {props.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Delete"
            onClick={() => props.onDelete(String(i.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];
