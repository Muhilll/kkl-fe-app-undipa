import { useToast } from "../../../../hooks/useToast";
import { kklKlpAPI } from "../service/kkl-klp.api";
import type { KklKlp, KklKlpFormData } from "../type/kkl-klp";

interface UseKklKlpCrudParams {
  editingKlp: () => KklKlp | null;
  deletingKlpId: () => string | null;
  setKlps: (value: KklKlp[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingKlp: (value: KklKlp | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingKlpId: (value: string | null) => void;
}

export const useKklKlpCrud = (params: UseKklKlpCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchKlps = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklKlpAPI.getAll();
      if (result.success && result.data) {
        params.setKlps(result.data);
      } else {
        params.setError(result.error || "Failed to fetch kkl klp");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitKlp = async (formData: KklKlpFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        nama: formData.nama,
        kkl_periode_id: Number(formData.kkl_periode_id),
        instansi_id: Number(formData.instansi_id),
        dosen_id: Number(formData.dosen_id),
      };

      const result = params.editingKlp()
        ? await kklKlpAPI.update(String(params.editingKlp()!.id), payload)
        : await kklKlpAPI.create(payload);

      if (result.success) {
        params.setEditingKlp(null);
        params.setShowForm(false);
        await fetchKlps();
        showToast("success", result.message || "Kelompok saved successfully");
      } else {
        const message = result.error || "Operation failed";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  const deleteKlp = async () => {
    const id = params.deletingKlpId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklKlpAPI.delete(id);

      if (result.success) {
        params.setDeletingKlpId(null);
        await fetchKlps();
        showToast("success", result.message || "Kelompok deleted successfully");
      } else {
        const message = result.error || "Failed to delete kelompok";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  return {
    toast,
    clearToast,
    fetchKlps,
    submitKlp,
    deleteKlp,
  };
};
