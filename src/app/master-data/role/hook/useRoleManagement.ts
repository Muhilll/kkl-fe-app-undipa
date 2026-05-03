import { createSignal, onMount } from "solid-js";
import { useRoleCrud } from "./useRoleCrud";
import type { Role } from "../type/role";

export const useRoleManagement = () => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingRole, setEditingRole] = createSignal<Role | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingRoleId, setDeletingRoleId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchRoles, submitRole, deleteRole } = useRoleCrud({
    editingRole,
    deletingRoleId,
    setRoles,
    setIsLoading,
    setError,
    setEditingRole,
    setShowForm,
    setDeletingRoleId,
  });

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingRole(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingRole(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingRoleId(id);
  };

  onMount(fetchRoles);

  return {
    roles,
    isLoading,
    error,
    editingRole,
    showForm,
    deletingRoleId,
    toast,
    clearToast,
    handleSubmit: submitRole,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteRole,
    setDeletingRoleId,
  };
};
