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
  const [selectedActivePeriodeId, setSelectedActivePeriodeId] = createSignal("");

  const { toast, clearToast, fetchPeriodes, submitPeriode, deletePeriode, activatePeriode } = useKklPeriodeCrud({
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

  const handleActivatePeriode = async () => {
    const targetId =
      selectedActivePeriodeId() ||
      periodes().find((periode) => periode.is_active)?.id.toString() ||
      "";
    if (!targetId) {
      setError("Pilih periode KKL yang akan diaktifkan.");
      return;
    }

    const activePeriode = periodes().find((periode) => periode.is_active);
    if (activePeriode?.id === Number(targetId)) {
      setError("Periode KKL tersebut sudah aktif.");
      return;
    }

    await activatePeriode(targetId);
  };

  onMount(fetchPeriodes);

  return {
    periodes,
    isLoading,
    error,
    editingPeriode,
    showForm,
    deletingPeriodeId,
    selectedActivePeriodeId,
    setSelectedActivePeriodeId,
    toast,
    clearToast,
    handleSubmit: submitPeriode,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deletePeriode,
    handleActivatePeriode,
    setDeletingPeriodeId,
  };
};
