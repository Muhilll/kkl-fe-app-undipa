import { Component, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useInstansiManagement } from "../hook/useInstansiManagement";
import InstansiForm from "./Form";
import InstansiTable from "./Table";

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

const InstansiPage: Component = () => {
  const instansiManagement = useInstansiManagement();
  const permissions = usePagePermissions();
  const navigate = useNavigate();

  return (
    <div class="user-page">
      <Toast toast={instansiManagement.toast()} onClose={instansiManagement.clearToast} />

      <PageHeader
        title="Instansi Management"
        description="Manage instansi (company/organization) data for KKL."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={instansiManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Instansi
          </button>
        ) : undefined}
      />

      <Show when={instansiManagement.error()}>
        <div class="error-message">{instansiManagement.error()}</div>
      </Show>

      <Modal open={instansiManagement.showForm()} onClose={instansiManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{instansiManagement.editingInstansi() ? "Edit Instansi" : "Add New Instansi"}</h2>
            <button
              onClick={instansiManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <InstansiForm
            initialData={instansiManagement.editingInstansi() || undefined}
            onSubmit={instansiManagement.handleSubmit}
            isLoading={instansiManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!instansiManagement.deletingInstansiId()}
        title="Delete Instansi"
        message="Are you sure you want to delete this instansi? This action cannot be undone."
        confirmLabel={instansiManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={instansiManagement.isLoading()}
        onConfirm={instansiManagement.handleDeleteConfirm}
        onCancel={() => instansiManagement.setDeletingInstansiId(null)}
      />

      <InstansiTable
        instansis={instansiManagement.instansis()}
        isLoading={instansiManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={instansiManagement.handleEdit}
        onDelete={instansiManagement.requestDelete}
        onManagePenilai={(id) => navigate(`/kkl-management/instansis/${id}/penilais`)}
      />
    </div>
  );
};

export default InstansiPage;
