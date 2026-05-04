import { createSignal, onMount } from "solid-js";
import { useInstansiCrud } from "./useInstansiCrud";
import type { Instansi } from "../type/instansi";

export const useInstansiManagement = () => {
  const [instansis, setInstansis] = createSignal<Instansi[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingInstansi, setEditingInstansi] = createSignal<Instansi | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingInstansiId, setDeletingInstansiId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchInstansis, submitInstansi, deleteInstansi } = useInstansiCrud({
    editingInstansi,
    deletingInstansiId,
    setInstansis,
    setIsLoading,
    setError,
    setEditingInstansi,
    setShowForm,
    setDeletingInstansiId,
  });

  const handleEdit = (instansi: Instansi) => {
    setEditingInstansi(instansi);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingInstansi(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingInstansi(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingInstansiId(id);
  };

  onMount(fetchInstansis);

  return {
    instansis,
    isLoading,
    error,
    editingInstansi,
    showForm,
    deletingInstansiId,
    toast,
    clearToast,
    handleSubmit: submitInstansi,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteInstansi,
    setDeletingInstansiId,
  };
};
