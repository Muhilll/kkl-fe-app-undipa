import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useInstansiPenilaiManagement } from "../hook/useInstansiPenilaiManagement";
import InstansiPenilaiForm from "./Form";
import InstansiPenilaiTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const InstansiPenilaiPage: Component = () => {
  const management = useInstansiPenilaiManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={management.toast()} onClose={management.clearToast} />

      <PageHeader
        title="Instansi Penilai Management"
        description="Kelola akun penilai dari instansi tempat KKL (Virtual Account otomatis membuat akun)."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={management.openCreateForm}>
            <IconPlusCircle />
            Buat Akun Penilai
          </button>
        ) : undefined}
      />

      <Show when={management.error()}>
        <div class="error-message">{management.error()}</div>
      </Show>

      <Modal open={management.showForm()} onClose={management.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{management.editingInstansiPenilai() ? "Edit Instansi Penilai" : "Buat Akun Instansi Penilai"}</h2>
            <button onClick={management.closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <InstansiPenilaiForm
            initialData={management.editingInstansiPenilai() || undefined}
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
        title="Delete Instansi Penilai"
        message="Are you sure you want to delete this Instansi Penilai? This action cannot be undone and will permanently remove their access."
        confirmLabel={management.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={management.isLoading()}
        onConfirm={management.handleDeleteConfirm}
        onCancel={() => management.setDeletingId(null)}
      />

      <InstansiPenilaiTable
        instansiPenilais={management.instansiPenilais()}
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

export default InstansiPenilaiPage;
