import { useToast } from "../../../../hooks/useToast";
import { userAPI } from "../service/user.api";
import type { User, UserFormData } from "../type/user";

interface UseUserCrudParams {
  editingUser: () => User | null;
  deletingUserId: () => string | null;
  setUsers: (value: User[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingUser: (value: User | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingUserId: (value: string | null) => void;
}

export const useUserCrud = (params: UseUserCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchUsers = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await userAPI.getAll();
      if (result.success && result.data) {
        params.setUsers(result.data);
      } else {
        params.setError(result.error || "Failed to fetch users");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitUser = async (data: UserFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      let result;
      
      const payload = {
        ...data,
        role_id: data.role_id ? parseInt(data.role_id, 10) : 0,
      };

      if (params.editingUser()) {
        const updatePayload = payload.password
          ? payload
          : { ...payload, password: undefined };
        result = await userAPI.update(
          String(params.editingUser()!.id),
          updatePayload,
        );
      } else {
        result = await userAPI.create(payload as any);
      }

      if (result.success) {
        params.setEditingUser(null);
        params.setShowForm(false);
        await fetchUsers();
        showToast("success", result.message || "User saved successfully");
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

  const deleteUser = async () => {
    const id = params.deletingUserId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await userAPI.delete(id);

      if (result.success) {
        params.setDeletingUserId(null);
        await fetchUsers();
        showToast("success", result.message || "User deleted successfully");
      } else {
        const message = result.error || "Failed to delete user";
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
    fetchUsers,
    submitUser,
    deleteUser,
  };
};
