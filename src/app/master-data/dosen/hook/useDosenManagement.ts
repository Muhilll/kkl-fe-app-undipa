import { createSignal, onMount } from "solid-js";
import { useDosenCrud } from "./useDosenCrud";
import type { Dosen } from "../type/dosen";

export const useDosenManagement = () => {
  const [dosens, setDosens] = createSignal<Dosen[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingDosen, setEditingDosen] = createSignal<Dosen | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingDosenId, setDeletingDosenId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchDosens, submitDosen, deleteDosen } = useDosenCrud({
    editingDosen,
    deletingDosenId,
    setDosens,
    setIsLoading,
    setError,
    setEditingDosen,
    setShowForm,
    setDeletingDosenId,
  });

  const handleEdit = (dosen: Dosen) => {
    setEditingDosen(dosen);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingDosen(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingDosen(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingDosenId(id);
  };

  onMount(fetchDosens);

  return {
    dosens,
    isLoading,
    error,
    editingDosen,
    showForm,
    deletingDosenId,
    toast,
    clearToast,
    handleSubmit: submitDosen,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteDosen,
    setDeletingDosenId,
  };
};
