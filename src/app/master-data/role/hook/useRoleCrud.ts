import { useToast } from "../../../../hooks/useToast";
import { roleAPI } from "../service/role.api";
import type { Role, RoleFormData } from "../type/role";

interface UseRoleCrudParams {
  editingRole: () => Role | null;
  deletingRoleId: () => string | null;
  setRoles: (value: Role[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingRole: (value: Role | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingRoleId: (value: string | null) => void;
}

export const useRoleCrud = (params: UseRoleCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchRoles = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await roleAPI.getAll();
      if (result.success && result.data) {
        params.setRoles(result.data);
      } else {
        params.setError(result.error || "Failed to fetch roles");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitRole = async (data: RoleFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = params.editingRole()
        ? await roleAPI.update(String(params.editingRole()!.id), data)
        : await roleAPI.create(data);

      if (result.success) {
        params.setEditingRole(null);
        params.setShowForm(false);
        await fetchRoles();
        showToast("success", result.message || "Role saved successfully");
      } else {
        const message = result.error || "Operation failed";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  const deleteRole = async () => {
    const id = params.deletingRoleId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await roleAPI.delete(id);

      if (result.success) {
        params.setDeletingRoleId(null);
        await fetchRoles();
        showToast("success", result.message || "Role deleted successfully");
      } else {
        const message = result.error || "Failed to delete role";
        params.setError(message);
        showToast("error", message);
      }
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
    fetchRoles,
    submitRole,
    deleteRole,
  };
};
