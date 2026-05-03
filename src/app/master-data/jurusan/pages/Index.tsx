import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useJurusanManagement } from "../hook/useJurusanManagement";
import JurusanForm from "./Form";
import JurusanTable from "./Table";

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

const JurusanPage: Component = () => {
  const jurusanManagement = useJurusanManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={jurusanManagement.toast()} onClose={jurusanManagement.clearToast} />

      <PageHeader
        title="Jurusan Management"
        description="Manage jurusan codes and names used across the system."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={jurusanManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Jurusan
          </button>
        ) : undefined}
      />

      <Show when={jurusanManagement.error()}>
        <div class="error-message">{jurusanManagement.error()}</div>
      </Show>

      <Modal open={jurusanManagement.showForm()} onClose={jurusanManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{jurusanManagement.editingJurusan() ? "Edit Jurusan" : "Add New Jurusan"}</h2>
            <button
              onClick={jurusanManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <JurusanForm
            initialData={jurusanManagement.editingJurusan() || undefined}
            onSubmit={jurusanManagement.handleSubmit}
            isLoading={jurusanManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!jurusanManagement.deletingJurusanId()}
        title="Delete Jurusan"
        message="Are you sure you want to delete this jurusan? This action cannot be undone."
        confirmLabel={jurusanManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={jurusanManagement.isLoading()}
        onConfirm={jurusanManagement.handleDeleteConfirm}
        onCancel={() => jurusanManagement.setDeletingJurusanId(null)}
      />

      <JurusanTable
        jurusans={jurusanManagement.jurusans()}
        isLoading={jurusanManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={jurusanManagement.handleEdit}
        onDelete={jurusanManagement.requestDelete}
      />
    </div>
  );
};

export default JurusanPage;
