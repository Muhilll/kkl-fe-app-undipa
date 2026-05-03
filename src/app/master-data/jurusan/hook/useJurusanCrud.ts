import { useToast } from "../../../../hooks/useToast";
import { jurusanAPI } from "../service/jurusan.api";
import type { Jurusan, JurusanFormData } from "../type/jurusan";

interface UseJurusanCrudParams {
  editingJurusan: () => Jurusan | null;
  deletingJurusanId: () => string | null;
  setJurusans: (value: Jurusan[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingJurusan: (value: Jurusan | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingJurusanId: (value: string | null) => void;
}

export const useJurusanCrud = (params: UseJurusanCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchJurusans = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await jurusanAPI.getAll();
      if (result.success && result.data) {
        params.setJurusans(result.data);
      } else {
        params.setError(result.error || "Failed to fetch jurusans");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitJurusan = async (data: JurusanFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = params.editingJurusan()
        ? await jurusanAPI.update(String(params.editingJurusan()!.id), data)
        : await jurusanAPI.create(data);

      if (result.success) {
        params.setEditingJurusan(null);
        params.setShowForm(false);
        await fetchJurusans();
        showToast("success", result.message || "Jurusan saved successfully");
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

  const deleteJurusan = async () => {
    const id = params.deletingJurusanId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await jurusanAPI.delete(id);

      if (result.success) {
        params.setDeletingJurusanId(null);
        await fetchJurusans();
        showToast("success", result.message || "Jurusan deleted successfully");
      } else {
        const message = result.error || "Failed to delete jurusan";
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
    fetchJurusans,
    submitJurusan,
    deleteJurusan,
  };
};
