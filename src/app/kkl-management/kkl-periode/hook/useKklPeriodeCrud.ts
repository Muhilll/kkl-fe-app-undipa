import { useToast } from "../../../../hooks/useToast";
import { kklPeriodeAPI } from "../service/kkl-periode.api";
import type { KklPeriode, KklPeriodeFormData } from "../type/kkl-periode";

interface UseKklPeriodeCrudParams {
  editingPeriode: () => KklPeriode | null;
  deletingPeriodeId: () => string | null;
  setPeriodes: (value: KklPeriode[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingPeriode: (value: KklPeriode | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingPeriodeId: (value: string | null) => void;
}

export const useKklPeriodeCrud = (params: UseKklPeriodeCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchPeriodes = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklPeriodeAPI.getAll();
      if (result.success && result.data) {
        params.setPeriodes(result.data);
      } else {
        params.setError(result.error || "Failed to fetch periodes");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitPeriode = async (formData: KklPeriodeFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        ...formData,
        max_agt_klp: Number(formData.max_agt_klp),
      };

      const result = params.editingPeriode()
        ? await kklPeriodeAPI.update(String(params.editingPeriode()!.id), payload)
        : await kklPeriodeAPI.create(payload as any);

      if (result.success) {
        params.setEditingPeriode(null);
        params.setShowForm(false);
        await fetchPeriodes();
        showToast("success", result.message || "Periode saved successfully");
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

  const deletePeriode = async () => {
    const id = params.deletingPeriodeId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await kklPeriodeAPI.delete(id);

      if (result.success) {
        params.setDeletingPeriodeId(null);
        await fetchPeriodes();
        showToast("success", result.message || "Periode deleted successfully");
      } else {
        const message = result.error || "Failed to delete periode";
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
    fetchPeriodes,
    submitPeriode,
    deletePeriode,
  };
};
