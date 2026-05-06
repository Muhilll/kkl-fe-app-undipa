import { createSignal, onMount } from "solid-js";
import { pembimbingLapanganAPI } from "../service/pembimbing-lapangan.api";
import { kklKlpAPI } from "../../kkl-klp/service/kkl-klp.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { PembimbingLapangan, CreatePembimbingLapanganInput, UpdatePembimbingLapanganInput } from "../type/pembimbing-lapangan";

export const usePembimbingLapanganManagement = () => {
  const [pembimbingLapangans, setPembimbingLapangans] = createSignal<PembimbingLapangan[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPembimbingLapangan, setEditingPembimbingLapangan] = createSignal<PembimbingLapangan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [plRes, klpRes, instansiRes, periodeRes] = await Promise.all([
        pembimbingLapanganAPI.getAll(),
        kklKlpAPI.getAll(),
        instansiAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);

      if (plRes.success && plRes.data) {
        setPembimbingLapangans(plRes.data);
      }
      if (klpRes.success && klpRes.data) {
        setKlps(klpRes.data);
      }
      if (instansiRes.success && instansiRes.data) setInstansis(instansiRes.data);
      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  const submitPembimbingLapangan = async (data: CreatePembimbingLapanganInput | UpdatePembimbingLapanganInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // Don't send empty password to backend during update
      const submitData = { ...data };
      if (!submitData.password) {
        delete submitData.password;
      }

      const editing = editingPembimbingLapangan();
      const result = editing
        ? await pembimbingLapanganAPI.update(String(editing.id), submitData as UpdatePembimbingLapanganInput)
        : await pembimbingLapanganAPI.create(submitData as CreatePembimbingLapanganInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Pembimbing Lapangan updated!" : "Pembimbing Lapangan created!" });
        setShowForm(false);
        setEditingPembimbingLapangan(null);
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Operation failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (pembimbingLapangan: PembimbingLapangan) => {
    setEditingPembimbingLapangan(pembimbingLapangan);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPembimbingLapangan(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPembimbingLapangan(null);
  };

  const requestDelete = (id: string) => setDeletingId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await pembimbingLapanganAPI.delete(id);
      if (result.success) {
        setToast({ type: "success", message: "Pembimbing Lapangan deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const availableKlps = () => {
    const takenKlpIds = pembimbingLapangans().map(pl => pl.kkl_klp_id);
    const editingId = editingPembimbingLapangan()?.kkl_klp_id;
    return klps().filter(k => {
      if (k.id === editingId) return true;
      return !takenKlpIds.includes(k.id);
    });
  };

  return {
    pembimbingLapangans,
    klps,
    availableKlps,
    instansis,
    periodes,
    isLoading,
    error,
    editingPembimbingLapangan,
    showForm,
    deletingId,
    setDeletingId,
    toast,
    clearToast,
    handleSubmit: submitPembimbingLapangan,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm,
  };
};
