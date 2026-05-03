import { createSignal, onMount } from "solid-js";
import { useMenuCrud } from "./useMenuCrud";
import type { Menu } from "../type/menu";

export const useMenuManagement = () => {
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingMenu, setEditingMenu] = createSignal<Menu | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingMenuId, setDeletingMenuId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchMenus, submitMenu, deleteMenu } = useMenuCrud({
    editingMenu,
    deletingMenuId,
    setMenus,
    setIsLoading,
    setError,
    setEditingMenu,
    setShowForm,
    setDeletingMenuId,
  });

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingMenu(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingMenu(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingMenuId(id);
  };

  onMount(fetchMenus);

  return {
    menus,
    isLoading,
    error,
    editingMenu,
    showForm,
    deletingMenuId,
    toast,
    clearToast,
    handleSubmit: submitMenu,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteMenu,
    setDeletingMenuId,
  };
};
