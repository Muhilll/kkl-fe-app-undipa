import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useRoleManagement } from "../hook/useRoleManagement";
import RoleForm from "./Form";
import RoleTable from "./Table";

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

const RolePage: Component = () => {
  const roleManagement = useRoleManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={roleManagement.toast()} onClose={roleManagement.clearToast} />

      <PageHeader
        title="Role Management"
        description="Manage role codes and names used across the system."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={roleManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Role
          </button>
        ) : undefined}
      />

      <Show when={roleManagement.error()}>
        <div class="error-message">{roleManagement.error()}</div>
      </Show>

      <Modal open={roleManagement.showForm()} onClose={roleManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{roleManagement.editingRole() ? "Edit Role" : "Add New Role"}</h2>
            <button
              onClick={roleManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <RoleForm
            initialData={roleManagement.editingRole() || undefined}
            onSubmit={roleManagement.handleSubmit}
            isLoading={roleManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!roleManagement.deletingRoleId()}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel={roleManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={roleManagement.isLoading()}
        onConfirm={roleManagement.handleDeleteConfirm}
        onCancel={() => roleManagement.setDeletingRoleId(null)}
      />

      <RoleTable
        roles={roleManagement.roles()}
        isLoading={roleManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={roleManagement.handleEdit}
        onDelete={roleManagement.requestDelete}
      />
    </div>
  );
};

export default RolePage;
