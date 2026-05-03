import { Show, type Component } from "solid-js";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useRolePermissionManagement } from "../hook/useRolePermissionManagement";
import RolePermissionForm from "./Form";
import RolePermissionTable from "./Table";

const RolePermissionPage: Component = () => {
  const rolePermissionManagement = useRolePermissionManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast
        toast={rolePermissionManagement.toast()}
        onClose={rolePermissionManagement.clearToast}
      />

      <PageHeader
        title="Role Permission Management"
        description="Manage permissions for each role across all menus."
      />

      <Show when={rolePermissionManagement.error()}>
        <div class="error-message">{rolePermissionManagement.error()}</div>
      </Show>

      <Modal
        open={rolePermissionManagement.showForm()}
        onClose={rolePermissionManagement.closeForm}
      >
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              Permissions for {rolePermissionManagement.selectedRole()?.name || "-"}
            </h2>
            <button
              onClick={rolePermissionManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <RolePermissionForm
            role={rolePermissionManagement.selectedRole()}
            items={rolePermissionManagement.permissionItems()}
            onSubmit={rolePermissionManagement.handleSubmit}
            isLoading={rolePermissionManagement.isLoading()}
          />
        </div>
      </Modal>

      <RolePermissionTable
        roles={rolePermissionManagement.roles()}
        rolePermissions={rolePermissionManagement.rolePermissions()}
        isLoading={rolePermissionManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        onManagePermissions={rolePermissionManagement.openPermissionForm}
      />
    </div>
  );
};

export default RolePermissionPage;
