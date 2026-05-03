import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useMahasiswaManagement } from "../hook/useMahasiswaManagement";
import MahasiswaForm from "./Form";
import MahasiswaTable from "./Table";

const IconPlusCircle = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const MahasiswaPage: Component = () => {
  const mahasiswaManagement = useMahasiswaManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={mahasiswaManagement.toast()} onClose={mahasiswaManagement.clearToast} />

      <PageHeader
        title="Mahasiswa Management"
        description="Manage mahasiswa data."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={mahasiswaManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Mahasiswa
          </button>
        ) : undefined}
      />

      <Show when={mahasiswaManagement.error()}>
        <div class="error-message">{mahasiswaManagement.error()}</div>
      </Show>

      <Modal open={mahasiswaManagement.showForm()} onClose={mahasiswaManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{mahasiswaManagement.editingMahasiswa() ? "Edit Mahasiswa" : "Add New Mahasiswa"}</h2>
            <button
              onClick={mahasiswaManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <MahasiswaForm
            initialData={mahasiswaManagement.editingMahasiswa() || undefined}
            onSubmit={mahasiswaManagement.handleSubmit}
            isLoading={mahasiswaManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!mahasiswaManagement.deletingMahasiswaId()}
        title="Delete Mahasiswa"
        message="Are you sure you want to delete this mahasiswa? This action cannot be undone."
        confirmLabel={mahasiswaManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={mahasiswaManagement.isLoading()}
        onConfirm={mahasiswaManagement.handleDeleteConfirm}
        onCancel={() => mahasiswaManagement.setDeletingMahasiswaId(null)}
      />

      <MahasiswaTable
        mahasiswas={mahasiswaManagement.mahasiswas()}
        isLoading={mahasiswaManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={mahasiswaManagement.handleEdit}
        onDelete={mahasiswaManagement.requestDelete}
      />
    </div>
  );
};

export default MahasiswaPage;
