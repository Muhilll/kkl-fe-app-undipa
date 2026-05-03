import { createSignal, onMount } from "solid-js";
import { useKklAgtCrud } from "./useKklAgtCrud";
import type { KklAgt } from "../type/kkl-agt";
import { kklKlpAPI } from "../../kkl-klp/service/kkl-klp.api";
import { mahasiswaAPI } from "../../master-data/mahasiswa/service/mahasiswa.api";
import { instansiAPI } from "../../master-data/instansi/service/instansi.api";
import { kklPeriodeAPI } from "../../master-data/kkl-periode/service/kkl-periode.api";

export const useKklAgtManagement = () => {
  const [agts, setAgts] = createSignal<KklAgt[]>([]);

  // Lookup data for foreign keys
  const [klps, setKlps] = createSignal<any[]>([]);
  const [mahasiswas, setMahasiswas] = createSignal<any[]>([]);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingAgt, setEditingAgt] = createSignal<KklAgt | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingAgtId, setDeletingAgtId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchAgts, submitAgt, deleteAgt } = useKklAgtCrud({
    editingAgt,
    deletingAgtId,
    setAgts,
    setIsLoading,
    setError,
    setEditingAgt,
    setShowForm,
    setDeletingAgtId,
  });

  const fetchLookups = async () => {
    try {
      const [resKlp, resMhs, resInstansi, resPeriode] = await Promise.all([
        kklKlpAPI.getAll(),
        mahasiswaAPI.getAll(),
        instansiAPI.getAll(),
        kklPeriodeAPI.getAll()
      ]);

      if (resKlp.success && resKlp.data) setKlps(resKlp.data);
      if (resMhs.success && resMhs.data) setMahasiswas(resMhs.data);
      if (resInstansi.success && resInstansi.data) setInstansis(resInstansi.data);
      if (resPeriode.success && resPeriode.data) setPeriodes(resPeriode.data);
    } catch (err) {
      console.error("Failed to fetch lookups", err);
    }
  };

  const handleEdit = (agt: KklAgt) => {
    setEditingAgt(agt);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingAgt(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingAgt(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingAgtId(id);
  };

  onMount(() => {
    fetchAgts();
    fetchLookups();
  });

  return {
    agts,
    klps,
    mahasiswas,
    instansis,
    periodes,
    isLoading,
    error,
    editingAgt,
    showForm,
    deletingAgtId,
    toast,
    clearToast,
    handleSubmit: submitAgt,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteAgt,
    setDeletingAgtId,
  };
};
