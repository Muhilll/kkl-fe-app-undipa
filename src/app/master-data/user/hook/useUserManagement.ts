import { createSignal, onMount } from "solid-js";
import { useUserCrud } from "./useUserCrud";
import type { User } from "../type/user";

export const useUserManagement = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingUser, setEditingUser] = createSignal<User | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingUserId, setDeletingUserId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchUsers, submitUser, deleteUser } = useUserCrud({
    editingUser,
    deletingUserId,
    setUsers,
    setIsLoading,
    setError,
    setEditingUser,
    setShowForm,
    setDeletingUserId,
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingUser(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingUserId(id);
  };

  onMount(fetchUsers);

  return {
    users,
    isLoading,
    error,
    editingUser,
    showForm,
    deletingUserId,
    toast,
    clearToast,
    handleSubmit: submitUser,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteUser,
    setDeletingUserId,
  };
};
