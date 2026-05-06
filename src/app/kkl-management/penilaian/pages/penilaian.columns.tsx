import type { DataTableColumn } from "../../../../components/ui/DataTable";
import type { PenilaianTableProps } from "../type/penilaian-props";
import type { Penilaian } from "../type/penilaian";

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

const getHuruf = (ratarataStr: string) => {
  const score = parseFloat(ratarataStr);
  if (isNaN(score)) return "-";
  if (score >= 86) return "A";
  if (score >= 81) return "A-";
  if (score >= 76) return "B+";
  if (score >= 71) return "B";
  if (score >= 66) return "B-";
  if (score >= 61) return "C+";
  if (score >= 56) return "C";
  if (score >= 41) return "D";
  return "E";
};

export const createPenilaianColumns = (
  props: Pick<PenilaianTableProps, "agts" | "penilais" | "onEdit" | "onDelete" | "canUpdate" | "canDelete">,
): DataTableColumn<Penilaian>[] => [
    { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (p) => p.id },
    {
      header: "Mahasiswa",
      cell: (p) => {
        const agt = props.agts.find(a => a.id === p.kkl_agt_id);
        return (
          <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
            <span style={{ "font-weight": "500" }}>{agt?.mahasiswa?.nama || "-"}</span>
            <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              NIM: {agt?.mahasiswa?.nim || "-"}
            </span>
          </div>
        );
      },
      sortValue: (p) => {
        const agt = props.agts.find(a => a.id === p.kkl_agt_id);
        return `${agt?.mahasiswa?.nama || ""} ${agt?.mahasiswa?.nim || ""}`;
      }
    },
    {
      header: "Pembimbing Lapangan",
      cell: (p) => {
        const penilai = props.penilais.find(i => i.id === p.pembimbing_id);
        return (
          <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
            <span style={{ "font-weight": "500" }}>{penilai?.nama || "-"}</span>
            <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              Jabatan: {penilai?.jabatan || "-"}
            </span>
          </div>
        );
      },
      sortValue: (p) => {
        const penilai = props.penilais.find(i => i.id === p.pembimbing_id);
        return `${penilai?.nama || ""} ${penilai?.jabatan || ""}`;
      }
    },
    {
      header: "Total Nilai",
      cell: (p) => <span style={{ "font-weight": "600", color: "var(--blue-600)" }}>{p.total}</span>,
      sortValue: (p) => p.total
    },
    {
      header: "Rata-rata",
      cell: (p) => <span style={{ "font-weight": "600", color: "var(--blue-600)" }}>{p.ratarata}</span>,
      sortValue: (p) => p.ratarata
    },
    {
      header: "Huruf",
      cell: (p) => {
        const huruf = getHuruf(p.ratarata);
        const color =
          huruf.startsWith("A") ? "var(--brand-600)" :
            huruf.startsWith("B") ? "var(--blue-600)" :
              huruf.startsWith("C") ? "var(--orange-600)" :
                "var(--red-600)";

        return (
          <span style={{
            "font-weight": "700",
            color,
            "background-color": `${color}15`,
            padding: "4px 8px",
            "border-radius": "4px"
          }}>
            {huruf}
          </span>
        );
      },
      sortValue: (p) => getHuruf(p.ratarata)
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
