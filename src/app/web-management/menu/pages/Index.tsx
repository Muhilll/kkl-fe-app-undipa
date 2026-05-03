import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useMenuManagement } from "../hook/useMenuManagement";
import MenuForm from "./Form";
import MenuTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const MenuPage: Component = () => {
  const menuManagement = useMenuManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={menuManagement.toast()} onClose={menuManagement.clearToast} />

      <PageHeader
        title="Menu Management"
        description="Manage web navigation menus and parent-child structure."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={menuManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Menu
          </button>
        ) : undefined}
      />

      <Show when={menuManagement.error()}>
        <div class="error-message">{menuManagement.error()}</div>
      </Show>

      <Modal open={menuManagement.showForm()} onClose={menuManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{menuManagement.editingMenu() ? "Edit Menu" : "Add New Menu"}</h2>
            <button onClick={menuManagement.closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <MenuForm
            initialData={menuManagement.editingMenu() || undefined}
            onSubmit={menuManagement.handleSubmit}
            isLoading={menuManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!menuManagement.deletingMenuId()}
        title="Delete Menu"
        message="Are you sure you want to delete this menu? This action cannot be undone."
        confirmLabel={menuManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={menuManagement.isLoading()}
        onConfirm={menuManagement.handleDeleteConfirm}
        onCancel={() => menuManagement.setDeletingMenuId(null)}
      />

      <MenuTable
        menus={menuManagement.menus()}
        isLoading={menuManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={menuManagement.handleEdit}
        onDelete={menuManagement.requestDelete}
      />
    </div>
  );
};

export default MenuPage;
