import { createSignal, onMount } from "solid-js";
import { useJurusanCrud } from "./useJurusanCrud";
import type { Jurusan } from "../type/jurusan";

export const useJurusanManagement = () => {
  const [jurusans, setJurusans] = createSignal<Jurusan[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingJurusan, setEditingJurusan] = createSignal<Jurusan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingJurusanId, setDeletingJurusanId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchJurusans, submitJurusan, deleteJurusan } = useJurusanCrud({
    editingJurusan,
    deletingJurusanId,
    setJurusans,
    setIsLoading,
    setError,
    setEditingJurusan,
    setShowForm,
    setDeletingJurusanId,
  });

  const handleEdit = (jurusan: Jurusan) => {
    setEditingJurusan(jurusan);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingJurusan(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingJurusan(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingJurusanId(id);
  };

  onMount(fetchJurusans);

  return {
    jurusans,
    isLoading,
    error,
    editingJurusan,
    showForm,
    deletingJurusanId,
    toast,
    clearToast,
    handleSubmit: submitJurusan,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteJurusan,
    setDeletingJurusanId,
  };
};
