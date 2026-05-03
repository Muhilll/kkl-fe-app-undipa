import { createSignal, onMount } from "solid-js";
import { useKklKlpCrud } from "./useKklKlpCrud";
import type { KklKlp } from "../type/kkl-klp";
import { kklPeriodeAPI } from "../../master-data/kkl-periode/service/kkl-periode.api";
import { instansiAPI } from "../../master-data/instansi/service/instansi.api";
import { dosenAPI } from "../../master-data/dosen/service/dosen.api";
import { useNavigate } from "@solidjs/router";

export const useKklKlpManagement = () => {
  const navigate = useNavigate();
  const [klps, setKlps] = createSignal<KklKlp[]>([]);

  // Lookup data for foreign keys
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [dosens, setDosens] = createSignal<any[]>([]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingKlp, setEditingKlp] = createSignal<KklKlp | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingKlpId, setDeletingKlpId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchKlps, submitKlp, deleteKlp } = useKklKlpCrud({
    editingKlp,
    deletingKlpId,
    setKlps,
    setIsLoading,
    setError,
    setEditingKlp,
    setShowForm,
    setDeletingKlpId,
  });

  const fetchLookups = async () => {
    try {
      const [resPeriode, resInstansi, resDosen] = await Promise.all([
        kklPeriodeAPI.getAll(),
        instansiAPI.getAll(),
        dosenAPI.getAll()
      ]);

      if (resPeriode.success && resPeriode.data) setPeriodes(resPeriode.data);
      if (resInstansi.success && resInstansi.data) setInstansis(resInstansi.data);
      if (resDosen.success && resDosen.data) setDosens(resDosen.data);
    } catch (err) {
      console.error("Failed to fetch lookups", err);
    }
  };

  const handleEdit = (klp: KklKlp) => {
    setEditingKlp(klp);
    setShowForm(true);
    setError(null);
  };

  const handleManageAnggota = (klp: KklKlp) => {
    navigate(`/kkl-klps/${klp.id}/anggota`);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingKlp(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingKlp(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingKlpId(id);
  };

  onMount(() => {
    fetchKlps();
    fetchLookups();
  });

  return {
    klps,
    periodes,
    instansis,
    dosens,
    isLoading,
    error,
    editingKlp,
    showForm,
    deletingKlpId,
    toast,
    clearToast,
    handleSubmit: submitKlp,
    handleEdit,
    handleManageAnggota,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteKlp,
    setDeletingKlpId,
  };
};
