import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
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

const UserPage: Component = () => {
  const userManagement = useUserManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={userManagement.toast()} onClose={userManagement.clearToast} />

      <PageHeader
        title="User Management"
        description="Managing the strategic distribution of users across the system."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data User",
                subtitle: "Daftar user yang terdaftar dalam sistem.",
                headers: ["No", "Username", "Role", "Status"],
                rows: userManagement.users().map((u, i) => [String(i + 1), u.username, u.role?.name || String(u.role_id), u.is_active ? "Active" : "Inactive"]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={userManagement.openCreateForm}>
                <IconPlusCircle />
                Add New User
              </button>
            </Show>
          </div>
        }
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
