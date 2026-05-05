import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useLaporanManagement } from "../hook/useLaporanManagement";
import LaporanForm from "./Form";
import LaporanTable from "./Table";

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

const LaporanPage: Component = () => {
  const laporanManagement = useLaporanManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={laporanManagement.toast()} onClose={laporanManagement.clearToast} />

      <PageHeader
        title="Laporan KKL Management"
        description="Manage laporan kegiatan KKL mahasiswa."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Laporan KKL",
                subtitle: "Daftar laporan kegiatan KKL mahasiswa.",
                headers: ["No", "Mahasiswa", "NIM", "Tanggal", "Jam", "Aktifitas", "Jarak", "Status"],
                rows: laporanManagement.laporans().map((p, i) => [String(i + 1), p.mahasiswa?.nama || "-", p.mahasiswa?.nim || "-", p.tanggal, p.jam, p.aktifitas, p.jarak ? `${p.jarak} m` : "-", p.status]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={laporanManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Laporan
              </button>
            </Show>
          </div>
        }
      />

      <Show when={laporanManagement.error()}>
        <div class="error-message">{laporanManagement.error()}</div>
      </Show>

      <Modal open={laporanManagement.showForm()} onClose={laporanManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{laporanManagement.editingLaporan() ? "Edit Laporan" : "Add New Laporan"}</h2>
            <button onClick={laporanManagement.closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <LaporanForm
            initialData={laporanManagement.editingLaporan() || undefined}
            agts={laporanManagement.agts()}
            instansis={laporanManagement.instansis()}
            klps={laporanManagement.klps()}
            periodes={laporanManagement.periodes()}
            onSubmit={laporanManagement.handleSubmit as any}
            isLoading={laporanManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!laporanManagement.deletingLaporanId()}
        title="Delete Laporan"
        message="Are you sure you want to delete this laporan? This action cannot be undone."
        confirmLabel={laporanManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={laporanManagement.isLoading()}
        onConfirm={laporanManagement.handleDeleteConfirm}
        onCancel={() => laporanManagement.setDeletingLaporanId(null)}
      />

      <LaporanTable
        laporans={laporanManagement.laporans()}
        isLoading={laporanManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={laporanManagement.handleEdit}
        onDelete={laporanManagement.requestDelete}
      />
    </div>
  );
};

export default LaporanPage;
