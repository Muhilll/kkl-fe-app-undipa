import { useToast } from "../../../../hooks/useToast";
import { mahasiswaAPI } from "../service/mahasiswa.api";
import type { Mahasiswa, MahasiswaFormData } from "../type/mahasiswa";

interface UseMahasiswaCrudParams {
  editingMahasiswa: () => Mahasiswa | null;
  deletingMahasiswaId: () => string | null;
  setMahasiswas: (value: Mahasiswa[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingMahasiswa: (value: Mahasiswa | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingMahasiswaId: (value: string | null) => void;
}

export const useMahasiswaCrud = (params: UseMahasiswaCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchMahasiswas = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await mahasiswaAPI.getAll();
      if (result.success && result.data) {
        params.setMahasiswas(result.data);
      } else {
        params.setError(result.error || "Failed to fetch mahasiswas");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitMahasiswa = async (formData: MahasiswaFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        ...formData,
        jurusan_id: Number(formData.jurusan_id),
      };

      const result = params.editingMahasiswa()
        ? await mahasiswaAPI.update(String(params.editingMahasiswa()!.id), payload)
        : await mahasiswaAPI.create(payload as any);

      if (result.success) {
        params.setEditingMahasiswa(null);
        params.setShowForm(false);
        await fetchMahasiswas();
        showToast("success", result.message || "Mahasiswa saved successfully");
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

  const deleteMahasiswa = async () => {
    const id = params.deletingMahasiswaId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await mahasiswaAPI.delete(id);

      if (result.success) {
        params.setDeletingMahasiswaId(null);
        await fetchMahasiswas();
        showToast("success", result.message || "Mahasiswa deleted successfully");
      } else {
        const message = result.error || "Failed to delete mahasiswa";
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
    fetchMahasiswas,
    submitMahasiswa,
    deleteMahasiswa,
  };
};
