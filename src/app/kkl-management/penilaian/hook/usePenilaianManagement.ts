import { createSignal, onMount } from "solid-js";
import { penilaianApi } from "../service/penilaian.api";
import type { Penilaian, CreatePenilaianInput, UpdatePenilaianInput } from "../type/penilaian";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";
import type { InstansiPenilai } from "../../instansi-penilai/type/instansi-penilai";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { instansiPenilaiAPI } from "../../instansi-penilai/service/instansi-penilai.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklKlpAPI } from "../../kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { Instansi } from "../../instansi/type/instansi";
import type { KklKlp } from "../../kkl-klp/type/kkl-klp";

export const usePenilaianManagement = () => {
  const [penilaians, setPenilaians] = createSignal<Penilaian[]>([]);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [penilais, setPenilais] = createSignal<InstansiPenilai[]>([]);
  const [instansis, setInstansis] = createSignal<Instansi[]>([]);
  const [klps, setKlps] = createSignal<KklKlp[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPenilaian, setEditingPenilaian] = createSignal<Penilaian | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingPenilaianId, setDeletingPenilaianId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [penilaianRes, agtRes, penilaiRes, instansiRes, klpRes, periodeRes] = await Promise.all([
        penilaianApi.getAll(),
        kklAgtAPI.getAll(),
        instansiPenilaiAPI.getAll(),
        instansiAPI.getAll(),
        kklKlpAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);
      if (penilaianRes.success) setPenilaians(penilaianRes.data || []);
      if (agtRes.success) setAgts(agtRes.data || []);
      if (penilaiRes.success) setPenilais(penilaiRes.data || []);
      if (instansiRes.success) setInstansis(instansiRes.data || []);
      if (klpRes.success) setKlps(klpRes.data || []);
      if (periodeRes.success) setPeriodes(periodeRes.data || []);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  const submitPenilaian = async (data: CreatePenilaianInput | UpdatePenilaianInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingPenilaian();
      const result = editing
        ? await penilaianApi.update(editing.id, data as UpdatePenilaianInput)
        : await penilaianApi.create(data as CreatePenilaianInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Penilaian updated!" : "Penilaian created!" });
        setShowForm(false);
        setEditingPenilaian(null);
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Operation failed" });
      }
    } catch (e: any) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (penilaian: Penilaian) => {
    setEditingPenilaian(penilaian);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPenilaian(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPenilaian(null);
  };

  const requestDelete = (id: string) => setDeletingPenilaianId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingPenilaianId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await penilaianApi.delete(Number(id));
      if (result.success) {
        setToast({ type: "success", message: "Penilaian deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingPenilaianId(null);
    }
  };

  return {
    penilaians,
    agts,
    penilais,
    instansis,
    klps,
    periodes,
    isLoading,
    error,
    editingPenilaian,
    showForm,
    deletingPenilaianId,
    setDeletingPenilaianId,
    toast,
    clearToast,
    handleSubmit: submitPenilaian,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm,
  };
};
