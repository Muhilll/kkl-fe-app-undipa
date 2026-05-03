import { createSignal, onMount } from "solid-js";
import { useMahasiswaCrud } from "./useMahasiswaCrud";
import type { Mahasiswa } from "../type/mahasiswa";

export const useMahasiswaManagement = () => {
  const [mahasiswas, setMahasiswas] = createSignal<Mahasiswa[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingMahasiswa, setEditingMahasiswa] = createSignal<Mahasiswa | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingMahasiswaId, setDeletingMahasiswaId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchMahasiswas, submitMahasiswa, deleteMahasiswa } = useMahasiswaCrud({
    editingMahasiswa,
    deletingMahasiswaId,
    setMahasiswas,
    setIsLoading,
    setError,
    setEditingMahasiswa,
    setShowForm,
    setDeletingMahasiswaId,
  });

  const handleEdit = (mahasiswa: Mahasiswa) => {
    setEditingMahasiswa(mahasiswa);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingMahasiswa(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingMahasiswa(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingMahasiswaId(id);
  };

  onMount(fetchMahasiswas);

  return {
    mahasiswas,
    isLoading,
    error,
    editingMahasiswa,
    showForm,
    deletingMahasiswaId,
    toast,
    clearToast,
    handleSubmit: submitMahasiswa,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteMahasiswa,
    setDeletingMahasiswaId,
  };
};
