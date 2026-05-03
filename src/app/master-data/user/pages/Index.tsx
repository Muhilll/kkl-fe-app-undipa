import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useUserManagement } from "../hook/useUserManagement";
import UserTable from "./Table";
import UserForm from "./Form";

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

const UserPage: Component = () => {
  const userManagement = useUserManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={userManagement.toast()} onClose={userManagement.clearToast} />

      <PageHeader
        title="User Management"
        description="Managing the strategic distribution of users across the system."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={userManagement.openCreateForm}>
            <IconPlusCircle />
            Add New User
          </button>
        ) : undefined}
      />

      <Show when={userManagement.error()}>
        <div class="error-message">{userManagement.error()}</div>
      </Show>

      <Modal open={userManagement.showForm()} onClose={userManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{userManagement.editingUser() ? "Edit User" : "Add New User"}</h2>
            <button
              onClick={userManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <UserForm
            initialData={userManagement.editingUser() || undefined}
            onSubmit={userManagement.handleSubmit}
            isLoading={userManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!userManagement.deletingUserId()}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel={userManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={userManagement.isLoading()}
        onConfirm={userManagement.handleDeleteConfirm}
        onCancel={() => userManagement.setDeletingUserId(null)}
      />

      <UserTable
        users={userManagement.users()}
        isLoading={userManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={userManagement.handleEdit}
        onDelete={userManagement.requestDelete}
      />
    </div>
  );
};

export default UserPage;
