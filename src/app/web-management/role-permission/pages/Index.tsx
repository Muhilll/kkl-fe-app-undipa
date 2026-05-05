import { Show, type Component } from "solid-js";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useRolePermissionManagement } from "../hook/useRolePermissionManagement";
import RolePermissionForm from "./Form";
import RolePermissionTable from "./Table";

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
        action={
          <Show when={permissions.canReport()}>
            <button class="btn-secondary" onClick={() => {
              const rps = rolePermissionManagement.rolePermissions();
              const countMenus = (rid: number) => new Set(rps.filter(rp => rp.role_id === rid).map(rp => rp.menu_id)).size;
              printTableToPdf({
                title: "Data Role Permission",
                subtitle: "Daftar role dan jumlah menu yang dikonfigurasi.",
                headers: ["No", "Role Name", "Role Code", "Menus Configured"],
                rows: rolePermissionManagement.roles().map((r, i) => [String(i + 1), r.name, r.code, String(countMenus(r.id))]),
              });
            }}>
              <IconPrinter />
              Cetak Data
            </button>
          </Show>
        }
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
