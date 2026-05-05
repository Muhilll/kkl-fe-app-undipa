import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
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

const RolePage: Component = () => {
  const roleManagement = useRoleManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={roleManagement.toast()} onClose={roleManagement.clearToast} />

      <PageHeader
        title="Role Management"
        description="Manage role codes and names used across the system."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Role",
                subtitle: "Daftar role yang terdaftar dalam sistem.",
                headers: ["No", "Code", "Name"],
                rows: roleManagement.roles().map((r, i) => [String(i + 1), r.code, r.name]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={roleManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Role
              </button>
            </Show>
          </div>
        }
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
