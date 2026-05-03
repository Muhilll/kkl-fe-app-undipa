import { useToast } from "../../../../hooks/useToast";
import { rolePermissionAPI } from "../service/role-permission.api";
import type {
  RolePermissionMatrixItem,
  RolePermission,
} from "../type/role-permission";

interface UseRolePermissionCrudParams {
  setRolePermissions: (value: RolePermission[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setShowForm: (value: boolean) => void;
}

export const useRolePermissionCrud = (params: UseRolePermissionCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchRolePermissions = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await rolePermissionAPI.getAll();
      if (result.success && result.data) {
        params.setRolePermissions(result.data);
      } else {
        params.setError(result.error || "Failed to fetch role permissions");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitRolePermissions = async (items: RolePermissionMatrixItem[]) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      for (const item of items) {
        const payload = {
          role_id: item.role_id,
          menu_id: item.menu_id,
          can_read: item.can_read,
          can_create: item.can_create,
          can_update: item.can_update,
          can_delete: item.can_delete,
          can_report: item.can_report,
        };

        const hasAnyPermission =
          item.can_read ||
          item.can_create ||
          item.can_update ||
          item.can_delete ||
          item.can_report;

        if (item.id) {
          const result = await rolePermissionAPI.update(String(item.id), payload);
          if (!result.success) {
            throw new Error(result.error || "Failed to update role permission");
          }
        } else if (hasAnyPermission) {
          const result = await rolePermissionAPI.create(payload);
          if (!result.success) {
            throw new Error(result.error || "Failed to create role permission");
          }
        }
      }

      params.setShowForm(false);
      await fetchRolePermissions();
      showToast("success", "Role permissions saved successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  return {
    toast,
    clearToast,
    fetchRolePermissions,
    submitRolePermissions,
  };
};
