import { createMemo, createSignal, onMount } from "solid-js";
import { lookupAPI } from "../../../../services/lookups";
import type { Role } from "../../../master-data/role/type/role";
import type { Menu } from "../../menu/type/menu";
import { useRolePermissionCrud } from "./useRolePermissionCrud";
import type { RolePermission, RolePermissionMatrixItem } from "../type/role-permission";

export const useRolePermissionManagement = () => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [rolePermissions, setRolePermissions] = createSignal<RolePermission[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [selectedRole, setSelectedRole] = createSignal<Role | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const { toast, clearToast, fetchRolePermissions, submitRolePermissions } =
    useRolePermissionCrud({
      setRolePermissions,
      setIsLoading,
      setError,
      setShowForm,
    });

  const loadOptions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [rolesResult, menusResult] = await Promise.all([
        lookupAPI.getRoles(),
        lookupAPI.getMenus(),
      ]);

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }

      if (menusResult.success && menusResult.data) {
        setMenus(menusResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const permissionItems = createMemo<RolePermissionMatrixItem[]>(() => {
    const role = selectedRole();
    if (!role) return [];

    return menus().map((menu) => {
      const existing = rolePermissions().find(
        (item) => item.role_id === role.id && item.menu_id === menu.id,
      );

      return {
        id: existing?.id,
        role_id: role.id,
        menu_id: menu.id,
        menu_name: menu.name,
        can_read: existing?.can_read || false,
        can_create: existing?.can_create || false,
        can_update: existing?.can_update || false,
        can_delete: existing?.can_delete || false,
        can_report: existing?.can_report || false,
      };
    });
  });

  const openPermissionForm = (role: Role) => {
    setSelectedRole(role);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setSelectedRole(null);
    setShowForm(false);
  };

  const initializePage = async () => {
    await Promise.all([loadOptions(), fetchRolePermissions()]);
  };

  onMount(initializePage);

  return {
    roles,
    menus,
    rolePermissions,
    permissionItems,
    isLoading,
    error,
    selectedRole,
    showForm,
    toast,
    clearToast,
    handleSubmit: submitRolePermissions,
    openPermissionForm,
    closeForm,
  };
};
