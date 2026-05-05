import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { LaporanTableProps } from "../type/laporan-props";
import type { Laporan } from "../type/laporan";

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const createLaporanColumns = (
  props: Pick<LaporanTableProps, "onEdit" | "onDelete" | "canUpdate" | "canDelete">,
): DataTableColumn<Laporan>[] => [
    { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (p) => p.id },
    {
      header: "Mahasiswa", cell: (p) => <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
        <span style={{ "font-weight": "500" }}>{p.mahasiswa?.nama || "-"}</span>
        <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
          NIM: {p.mahasiswa?.nim || "-"}
        </span>
      </div>,
      sortValue: (p) => `${p.mahasiswa?.nama || ""} ${p.mahasiswa?.nim || ""}`
    },
    { header: "Tanggal", cell: (p) => <>{p.tanggal}</>, sortValue: (p) => p.tanggal },
    { header: "Jam", cell: (p) => <>{p.jam}</>, sortValue: (p) => p.jam },
    { header: "Aktifitas", cell: (p) => <>{p.aktifitas.length > 50 ? p.aktifitas.substring(0, 50) + "..." : p.aktifitas}</>, sortValue: (p) => p.aktifitas },
    {
      header: "File",
      sortable: false,
      cell: (p) => (
        <>
          {p.file ? (
            <a href={p.file} target="_blank" rel="noopener noreferrer" title="Lihat File" style={{ color: "var(--blue-600, #2563eb)", "text-decoration": "none", display: "inline-flex", "align-items": "center", "justify-content": "center" }}>
              <IconEye />
            </a>
          ) : (
            <span style={{ color: "var(--gray-400, #9ca3af)", "font-size": "12px" }}>-</span>
          )}
        </>
      ),
    },
    { header: "Jarak", cell: (p) => <>{p.jarak ? `${p.jarak} m` : "-"}</>, sortValue: (p) => p.jarak || 0 },
    {
      header: "Status",
      sortValue: (p) => p.status,
      cell: (p) => (
        <span style={{
          padding: "4px 10px",
          "border-radius": "12px",
          "font-size": "12px",
          "font-weight": "600",
          "background-color": p.status === "valid" ? "var(--brand-100, #dcfce7)" : "var(--red-100, #fee2e2)",
          color: p.status === "valid" ? "var(--brand-700, #15803d)" : "var(--red-700, #b91c1c)",
        }}>
          {p.status}
        </span>
      ),
    },
    {
      header: "Actions",
      sortable: false,
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
            <button class="btn-icon btn-delete" title="Delete" onClick={() => props.onDelete(String(p.id))}>
              <IconTrash />
            </button>
          )}
        </div>
      ),
    },
  ];
