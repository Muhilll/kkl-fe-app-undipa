import { createSignal, onMount } from "solid-js";
import { laporanAPI } from "../service/laporan.api";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklKlpAPI } from "../../kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { Laporan, CreateLaporanInput, UpdateLaporanInput } from "../type/laporan";

export const useLaporanManagement = () => {
  const [laporans, setLaporans] = createSignal<Laporan[]>([]);
  const [agts, setAgts] = createSignal<any[]>([]);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingLaporan, setEditingLaporan] = createSignal<Laporan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingLaporanId, setDeletingLaporanId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [laporanRes, agtRes, instansiRes, klpRes, periodeRes] = await Promise.all([
        laporanAPI.getAll(),
        kklAgtAPI.getAll(),
        instansiAPI.getAll(),
        kklKlpAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);
      if (laporanRes.success && laporanRes.data) setLaporans(laporanRes.data);
      if (agtRes.success && agtRes.data) setAgts(agtRes.data);
      if (instansiRes.success && instansiRes.data) setInstansis(instansiRes.data);
      if (klpRes.success && klpRes.data) setKlps(klpRes.data);
      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  const submitLaporan = async (data: CreateLaporanInput | UpdateLaporanInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingLaporan();
      const result = editing
        ? await laporanAPI.update(String(editing.id), data as UpdateLaporanInput)
        : await laporanAPI.create(data as CreateLaporanInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Laporan updated!" : "Laporan created!" });
        setShowForm(false);
        setEditingLaporan(null);
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

  const handleEdit = (laporan: Laporan) => {
    setEditingLaporan(laporan);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingLaporan(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLaporan(null);
  };

  const requestDelete = (id: string) => setDeletingLaporanId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingLaporanId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await laporanAPI.delete(id);
      if (result.success) {
        setToast({ type: "success", message: "Laporan deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingLaporanId(null);
    }
  };

  return {
    laporans,
    agts,
    instansis,
    klps,
    periodes,
    isLoading,
    error,
    editingLaporan,
    showForm,
    deletingLaporanId,
    setDeletingLaporanId,
    toast,
    clearToast,
    handleSubmit: submitLaporan,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm,
  };
};
