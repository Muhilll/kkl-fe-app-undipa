import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { usePembimbingLapanganManagement } from "../hook/usePembimbingLapanganManagement";
import PembimbingLapanganForm from "./Form";
import PembimbingLapanganTable from "./Table";

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

const PembimbingLapanganPage: Component = () => {
  const management = usePembimbingLapanganManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={management.toast()} onClose={management.clearToast} />

      <PageHeader
        title="Pembimbing Lapangan Management"
        description="Kelola akun pembimbing lapangan tempat KKL (Virtual Account otomatis membuat akun)."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => {
                const klps = management.klps();
                printTableToPdf({
                  title: "Data Pembimbing Lapangan",
                  subtitle: "Daftar akun pembimbing lapangan tempat KKL.",
                  headers: ["No", "Virtual Account", "Nama", "Jabatan", "Kelompok KKL"],
                  rows: management.pembimbingLapangans().map((p, i) => {
                    const klp = klps.find(k => k.id === p.kkl_klp_id);
                    return [String(i + 1), p.virtual_account, p.nama, p.jabatan, klp?.nama || "-"];
                  }),
                });
              }}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={management.openCreateForm}>
                <IconPlusCircle />
                Buat Akun Pembimbing
              </button>
            </Show>
          </div>
        }
      />

      <Show when={management.error()}>
        <div class="error-message">{management.error()}</div>
      </Show>

      <Modal open={management.showForm()} onClose={management.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{management.editingPembimbingLapangan() ? "Edit Pembimbing Lapangan" : "Buat Akun Pembimbing Lapangan"}</h2>
            <button onClick={management.closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <PembimbingLapanganForm
            initialData={management.editingPembimbingLapangan() || undefined}
            klps={management.availableKlps()}
            instansis={management.instansis()}
            periodes={management.periodes()}
            onSubmit={management.handleSubmit}
            isLoading={management.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!management.deletingId()}
        title="Delete Pembimbing Lapangan"
        message="Are you sure you want to delete this Pembimbing Lapangan? This action cannot be undone and will permanently remove their access."
        confirmLabel={management.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={management.isLoading()}
        onConfirm={management.handleDeleteConfirm}
        onCancel={() => management.setDeletingId(null)}
      />

      <PembimbingLapanganTable
        pembimbingLapangans={management.pembimbingLapangans()}
        klps={management.klps()}
        isLoading={management.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={management.handleEdit}
        onDelete={management.requestDelete}
      />
    </div>
  );
};

export default PembimbingLapanganPage;
