import { useToast } from "../../../../hooks/useToast";
import { instansiAPI } from "../service/instansi.api";
import type { Instansi, InstansiFormData } from "../type/instansi";

interface UseInstansiCrudParams {
  editingInstansi: () => Instansi | null;
  deletingInstansiId: () => string | null;
  setInstansis: (value: Instansi[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingInstansi: (value: Instansi | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingInstansiId: (value: string | null) => void;
}

export const useInstansiCrud = (params: UseInstansiCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchInstansis = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await instansiAPI.getAll();
      if (result.success && result.data) {
        params.setInstansis(result.data);
      } else {
        params.setError(result.error || "Failed to fetch instansis");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitInstansi = async (formData: InstansiFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        ...formData,
        telp: formData.telp || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
      };

      const result = params.editingInstansi()
        ? await instansiAPI.update(String(params.editingInstansi()!.id), payload)
        : await instansiAPI.create(payload as any);

      if (result.success) {
        params.setEditingInstansi(null);
        params.setShowForm(false);
        await fetchInstansis();
        showToast("success", result.message || "Instansi saved successfully");
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

  const deleteInstansi = async () => {
    const id = params.deletingInstansiId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await instansiAPI.delete(id);

      if (result.success) {
        params.setDeletingInstansiId(null);
        await fetchInstansis();
        showToast("success", result.message || "Instansi deleted successfully");
      } else {
        const message = result.error || "Failed to delete instansi";
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
    fetchInstansis,
    submitInstansi,
    deleteInstansi,
  };
};
