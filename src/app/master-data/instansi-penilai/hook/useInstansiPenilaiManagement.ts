import { createSignal, onMount } from "solid-js";
import { instansiPenilaiAPI } from "../service/instansi-penilai.api";
import { kklKlpAPI } from "../../../kkl-klp/service/kkl-klp.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { InstansiPenilai, CreateInstansiPenilaiInput, UpdateInstansiPenilaiInput } from "../type/instansi-penilai";

export const useInstansiPenilaiManagement = () => {
  const [instansiPenilais, setInstansiPenilais] = createSignal<InstansiPenilai[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]); // KKL Kelompoks for dropdown
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingInstansiPenilai, setEditingInstansiPenilai] = createSignal<InstansiPenilai | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ipRes, klpRes, instansiRes, periodeRes] = await Promise.all([
        instansiPenilaiAPI.getAll(),
        kklKlpAPI.getAll(),
        instansiAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);

      if (ipRes.success && ipRes.data) {
        setInstansiPenilais(ipRes.data);
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

  const submitInstansiPenilai = async (data: CreateInstansiPenilaiInput | UpdateInstansiPenilaiInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // Don't send empty password to backend during update
      const submitData = { ...data };
      if (!submitData.password) {
        delete submitData.password;
      }

      const editing = editingInstansiPenilai();
      const result = editing
        ? await instansiPenilaiAPI.update(String(editing.id), submitData as UpdateInstansiPenilaiInput)
        : await instansiPenilaiAPI.create(submitData as CreateInstansiPenilaiInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Instansi Penilai updated!" : "Instansi Penilai created!" });
        setShowForm(false);
        setEditingInstansiPenilai(null);
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

  const handleEdit = (instansiPenilai: InstansiPenilai) => {
    setEditingInstansiPenilai(instansiPenilai);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingInstansiPenilai(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingInstansiPenilai(null);
  };

  const requestDelete = (id: string) => setDeletingId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await instansiPenilaiAPI.delete(id);
      if (result.success) {
        setToast({ type: "success", message: "Instansi Penilai deleted!" });
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

  return {
    instansiPenilais,
    klps,
    instansis,
    periodes,
    isLoading,
    error,
    editingInstansiPenilai,
    showForm,
    deletingId,
    setDeletingId,
    toast,
    clearToast,
    handleSubmit: submitInstansiPenilai,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm,
  };
};
