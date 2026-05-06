import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { PembimbingLapanganTableProps } from "../type/pembimbing-lapangan-props";
import type { PembimbingLapangan } from "../type/pembimbing-lapangan";

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

export const createPembimbingLapanganColumns = (
  props: Pick<PembimbingLapanganTableProps, "onEdit" | "onDelete" | "canUpdate" | "canDelete" | "klps">,
): DataTableColumn<PembimbingLapangan>[] => [
    { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (p) => p.id },
    {
      header: "Virtual Account",
      cell: (p) => (
        <div style={{ "font-family": "monospace", "font-size": "13px", "font-weight": "bold", color: "var(--blue-700, #1d4ed8)", padding: "4px 8px", "background-color": "var(--blue-50, #eff6ff)", "border-radius": "4px", display: "inline-block" }}>
          {p.virtual_account}
        </div>
      ),
      sortValue: (p) => p.virtual_account
    },
    { header: "Nama", cell: (p) => <>{p.nama}</>, sortValue: (p) => p.nama },
    { header: "Jabatan", cell: (p) => <>{p.jabatan}</>, sortValue: (p) => p.jabatan },
    {
      header: "Kelompok KKL",
      cell: (p) => {
        const klp = props.klps.find(k => k.id === p.kkl_klp_id);
        return (
          <>
            {klp ? (
              <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
                <span style={{ "font-weight": "500" }}>{klp.nama}</span>
                <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
                  {klp.dosen?.nama || "-"} ({klp.dosen?.nidn})
                </span>
                <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
                  {klp.instansi?.nama || "-"}
                </span>
              </div>
            ) : "-"}
          </>
        );
      },
      sortValue: (p) => {
        const klp = props.klps.find(k => k.id === p.kkl_klp_id);
        return klp ? `${klp.nama} ${klp.dosen?.nama || ""} ${klp.instansi?.nama || ""}` : "";
      }
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
