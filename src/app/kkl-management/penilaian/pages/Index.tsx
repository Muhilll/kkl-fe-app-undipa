import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { usePenilaianManagement } from "../hook/usePenilaianManagement";
import PenilaianForm from "./Form";
import PenilaianTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconPrinter = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const PenilaianPage: Component = () => {
  const penilaianManagement = usePenilaianManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={penilaianManagement.toast()} onClose={penilaianManagement.clearToast} />

      <PageHeader
        title="Penilaian KKL Management"
        description="Manage penilaian kegiatan KKL mahasiswa."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => {
                const agts = penilaianManagement.agts();
                const penilais = penilaianManagement.penilais();
                const getHuruf = (r: string) => { const s = parseFloat(r); if (isNaN(s)) return "-"; if (s >= 86) return "A"; if (s >= 81) return "A-"; if (s >= 76) return "B+"; if (s >= 71) return "B"; if (s >= 66) return "B-"; if (s >= 61) return "C+"; if (s >= 56) return "C"; if (s >= 41) return "D"; return "E"; };
                printTableToPdf({
                  title: "Data Penilaian KKL",
                  subtitle: "Daftar penilaian kegiatan KKL mahasiswa.",
                  headers: ["No", "Mahasiswa", "NIM", "Penilai", "Total", "Rata-rata", "Huruf"],
                  rows: penilaianManagement.penilaians().map((p, i) => {
                    const agt = agts.find(a => a.id === p.kkl_agt_id);
                    const penilai = penilais.find(ip => ip.id === p.pembimbing_id);
                    return [String(i + 1), agt?.mahasiswa?.nama || "-", agt?.mahasiswa?.nim || "-", penilai?.nama || "-", String(p.total), String(p.ratarata), getHuruf(p.ratarata)];
                  }),
                });
              }}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={penilaianManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Penilaian
              </button>
            </Show>
          </div>
        }
      />

      <Show when={penilaianManagement.error()}>
        <div class="error-message">{penilaianManagement.error()}</div>
      </Show>

      <Modal open={penilaianManagement.showForm()} onClose={penilaianManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{penilaianManagement.editingPenilaian() ? "Edit Penilaian" : "Add New Penilaian"}</h2>
            <button onClick={penilaianManagement.closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <PenilaianForm
            initialData={penilaianManagement.editingPenilaian() || undefined}
            agts={penilaianManagement.agts()}
            penilais={penilaianManagement.penilais()}
            instansis={penilaianManagement.instansis()}
            klps={penilaianManagement.klps()}
            periodes={penilaianManagement.periodes()}
            onSubmit={penilaianManagement.handleSubmit}
            isLoading={penilaianManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!penilaianManagement.deletingPenilaianId()}
        title="Delete Penilaian"
        message="Are you sure you want to delete this penilaian? This action cannot be undone."
        confirmLabel={penilaianManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={penilaianManagement.isLoading()}
        onConfirm={penilaianManagement.handleDeleteConfirm}
        onCancel={() => penilaianManagement.setDeletingPenilaianId(null)}
      />

      <PenilaianTable
        penilaians={penilaianManagement.penilaians()}
        agts={penilaianManagement.agts()}
        penilais={penilaianManagement.penilais()}
        isLoading={penilaianManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={penilaianManagement.handleEdit}
        onDelete={penilaianManagement.requestDelete}
      />
    </div>
  );
};

export default PenilaianPage;
