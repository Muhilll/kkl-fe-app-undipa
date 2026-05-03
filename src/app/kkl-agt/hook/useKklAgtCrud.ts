import { useToast } from "../../../hooks/useToast";
import { kklAgtAPI } from "../service/kkl-agt.api";
import type { KklAgt, KklAgtFormData } from "../type/kkl-agt";

interface UseKklAgtCrudParams {
  editingAgt: () => KklAgt | null;
  deletingAgtId: () => string | null;
  setAgts: (value: KklAgt[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingAgt: (value: KklAgt | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingAgtId: (value: string | null) => void;
}

export const useKklAgtCrud = (params: UseKklAgtCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchAgts = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklAgtAPI.getAll();
      if (result.success && result.data) {
        params.setAgts(result.data);
      } else {
        params.setError(result.error || "Failed to fetch kkl anggota");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitAgt = async (formData: KklAgtFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        kkl_klp_id: Number(formData.kkl_klp_id),
        mahasiswa_id: Number(formData.mahasiswa_id),
      };

      const result = params.editingAgt()
        ? await kklAgtAPI.update(String(params.editingAgt()!.id), payload)
        : await kklAgtAPI.create(payload);

      if (result.success) {
        params.setEditingAgt(null);
        params.setShowForm(false);
        await fetchAgts();
        showToast("success", result.message || "Anggota saved successfully");
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

  const deleteAgt = async () => {
    const id = params.deletingAgtId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklAgtAPI.delete(id);

      if (result.success) {
        params.setDeletingAgtId(null);
        await fetchAgts();
        showToast("success", result.message || "Anggota deleted successfully");
      } else {
        const message = result.error || "Failed to delete anggota";
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
    fetchAgts,
    submitAgt,
    deleteAgt,
  };
};
