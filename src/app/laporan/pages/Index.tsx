import { Component, Show } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
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

const LaporanPage: Component = () => {
  const laporanManagement = useLaporanManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={laporanManagement.toast()} onClose={laporanManagement.clearToast} />

      <PageHeader
        title="Laporan KKL Management"
        description="Manage laporan kegiatan KKL mahasiswa."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={laporanManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Laporan
          </button>
        ) : undefined}
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
