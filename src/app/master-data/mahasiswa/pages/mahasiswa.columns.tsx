import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { MahasiswaTableProps } from "../type/mahasiswa-props";
import type { Mahasiswa } from "../type/mahasiswa";

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

export const createMahasiswaColumns = (
  props: Pick<MahasiswaTableProps, "onEdit" | "onDelete" | "canUpdate" | "canDelete">,
): DataTableColumn<Mahasiswa>[] => [
  { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (m) => m.id },
  { header: "NIM", cell: (m) => <>{m.nim}</>, sortValue: (m) => m.nim },
  { header: "Nama", cell: (m) => <>{m.nama}</>, sortValue: (m) => m.nama },
  { header: "Email", cell: (m) => <>{m.email}</>, sortValue: (m) => m.email },
  { header: "Telp", cell: (m) => <>{m.telp}</>, sortValue: (m) => m.telp },
  {
    header: "Jurusan",
    cell: (m) => <>{m.jurusan?.nama || m.jurusan_id}</>,
    sortValue: (m) => m.jurusan?.nama || m.jurusan_id,
  },
  {
    header: "Actions",
    sortable: false,
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (m) => (
      <div class="action-btns">
        {props.canUpdate && (
          <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(m)}>
            <IconEdit />
          </button>
        )}
        {props.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Delete"
            onClick={() => props.onDelete(String(m.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];
