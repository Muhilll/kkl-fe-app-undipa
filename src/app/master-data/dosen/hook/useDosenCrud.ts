import { useToast } from "../../../../hooks/useToast";
import { dosenAPI } from "../service/dosen.api";
import type { Dosen, DosenFormData } from "../type/dosen";

interface UseDosenCrudParams {
  editingDosen: () => Dosen | null;
  deletingDosenId: () => string | null;
  setDosens: (value: Dosen[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingDosen: (value: Dosen | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingDosenId: (value: string | null) => void;
}

export const useDosenCrud = (params: UseDosenCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchDosens = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await dosenAPI.getAll();
      if (result.success && result.data) {
        params.setDosens(result.data);
      } else {
        params.setError(result.error || "Failed to fetch dosens");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitDosen = async (formData: DosenFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = { ...formData };

      const result = params.editingDosen()
        ? await dosenAPI.update(String(params.editingDosen()!.id), payload)
        : await dosenAPI.create(payload as any);

      if (result.success) {
        params.setEditingDosen(null);
        params.setShowForm(false);
        await fetchDosens();
        showToast("success", result.message || "Dosen saved successfully");
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

  const deleteDosen = async () => {
    const id = params.deletingDosenId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await dosenAPI.delete(id);

      if (result.success) {
        params.setDeletingDosenId(null);
        await fetchDosens();
        showToast("success", result.message || "Dosen deleted successfully");
      } else {
        const message = result.error || "Failed to delete dosen";
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
    fetchDosens,
    submitDosen,
    deleteDosen,
  };
};
