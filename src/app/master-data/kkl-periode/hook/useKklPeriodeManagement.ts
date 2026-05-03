import { createSignal, onMount } from "solid-js";
import { useKklPeriodeCrud } from "./useKklPeriodeCrud";
import type { KklPeriode } from "../type/kkl-periode";

export const useKklPeriodeManagement = () => {
  const [periodes, setPeriodes] = createSignal<KklPeriode[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPeriode, setEditingPeriode] = createSignal<KklPeriode | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingPeriodeId, setDeletingPeriodeId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchPeriodes, submitPeriode, deletePeriode } = useKklPeriodeCrud({
    editingPeriode,
    deletingPeriodeId,
    setPeriodes,
    setIsLoading,
    setError,
    setEditingPeriode,
    setShowForm,
    setDeletingPeriodeId,
  });

  const handleEdit = (periode: KklPeriode) => {
    setEditingPeriode(periode);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPeriode(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingPeriode(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingPeriodeId(id);
  };

  onMount(fetchPeriodes);

  return {
    periodes,
    isLoading,
    error,
    editingPeriode,
    showForm,
    deletingPeriodeId,
    toast,
    clearToast,
    handleSubmit: submitPeriode,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deletePeriode,
    setDeletingPeriodeId,
  };
};
