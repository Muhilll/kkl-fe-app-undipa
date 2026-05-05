import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { KklKlpTableProps } from "../type/kkl-klp-props";
import type { KklKlp } from "../type/kkl-klp";

const IconUsers = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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

export const createKklKlpColumns = (
  props: Pick<KklKlpTableProps, "onEdit" | "onDelete" | "onManageAnggota" | "canUpdate" | "canDelete">,
): DataTableColumn<KklKlp>[] => [
    { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (p) => p.id },
    { header: "Nama Kelompok", cell: (p) => <>{p.nama}</>, sortValue: (p) => p.nama },
    { header: "Periode", cell: (p) => <>{p.kkl_periode?.nama} ({p.kkl_periode?.tahun})</>, sortValue: (p) => `${p.kkl_periode?.nama || ""} ${p.kkl_periode?.tahun || ""}` },
    { header: "Instansi", cell: (p) => <>{p.instansi?.nama}</>, sortValue: (p) => p.instansi?.nama || "" },
    { header: "Dosen Pembimbing", cell: (p) => <>{p.dosen?.nama} - {p.dosen?.nidn}</>, sortValue: (p) => `${p.dosen?.nama || ""} ${p.dosen?.nidn || ""}` },
    {
      header: "Actions",
      sortable: false,
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (p) => (
        <div class="action-btns">
          <button class="btn-icon" style={{ color: "var(--blue-600)" }} title="Kelola Anggota" onClick={() => props.onManageAnggota(p)}>
            <IconUsers />
          </button>
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
