import { useToast } from "../../../../hooks/useToast";
import { menuAPI } from "../service/menu.api";
import type { Menu, MenuFormData } from "../type/menu";

interface UseMenuCrudParams {
  editingMenu: () => Menu | null;
  deletingMenuId: () => string | null;
  setMenus: (value: Menu[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingMenu: (value: Menu | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingMenuId: (value: string | null) => void;
}

export const useMenuCrud = (params: UseMenuCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchMenus = async () => {
    params.setIsLoading(true);
    params.setError(null);
    try {
      const result = await menuAPI.getAll();
      if (result.success && result.data) {
        params.setMenus(result.data);
      } else {
        params.setError(result.error || "Failed to fetch menus");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitMenu = async (data: MenuFormData) => {
    params.setIsLoading(true);
    params.setError(null);
    try {
      const payload = {
        name: data.name,
        path: data.path || null,
        permission_path: data.permission_path || null,
        icon: data.icon || null,
        parent_id: data.parent_id ? parseInt(data.parent_id, 10) : null,
      };

      const result = params.editingMenu()
        ? await menuAPI.update(String(params.editingMenu()!.id), payload)
        : await menuAPI.create(payload);

      if (result.success) {
        params.setEditingMenu(null);
        params.setShowForm(false);
        await fetchMenus();
        showToast("success", result.message || "Menu saved successfully");
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

  const deleteMenu = async () => {
    const id = params.deletingMenuId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);
    try {
      const result = await menuAPI.delete(id);
      if (result.success) {
        params.setDeletingMenuId(null);
        await fetchMenus();
        showToast("success", result.message || "Menu deleted successfully");
      } else {
        const message = result.error || "Failed to delete menu";
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
    fetchMenus,
    submitMenu,
    deleteMenu,
  };
};
