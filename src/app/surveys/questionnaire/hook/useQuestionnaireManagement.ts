import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { questionnaireAPI } from "../service/questionnaire.api";
import type {
  CreateQuestionnaireInput,
  Questionnaire,
  UpdateQuestionnaireInput,
} from "../type/questionnaire";

export const useQuestionnaireManagement = () => {
  const navigate = useNavigate();
  const [questionnaires, setQuestionnaires] = createSignal<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingQuestionnaire, setEditingQuestionnaire] =
    createSignal<Questionnaire | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await questionnaireAPI.getAll();
      if (res.success && res.data) {
        setQuestionnaires(res.data);
      } else {
        setError(res.error || "Gagal memuat kuesioner.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    data: CreateQuestionnaireInput | UpdateQuestionnaireInput,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingQuestionnaire();
      let res;
      if (editing) {
        res = await questionnaireAPI.update(editing.id, data);
      } else {
        res = await questionnaireAPI.create(data as CreateQuestionnaireInput);
      }

      if (res.success) {
        setToast({
          message: editing
            ? "Kuesioner berhasil diperbarui!"
            : "Kuesioner berhasil ditambahkan!",
          type: "success",
        });
        closeForm();
        await fetchQuestionnaires();
      } else {
        setError(res.error || "Gagal menyimpan kuesioner.");
        setToast({
          message: res.error || "Gagal menyimpan kuesioner.",
          type: "error",
        });
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan kuesioner.");
      setToast({
        message: "Terjadi kesalahan saat menyimpan kuesioner.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await questionnaireAPI.delete(id);
      if (res.success) {
        setToast({
          message: "Kuesioner berhasil dihapus!",
          type: "success",
        });
        setDeletingId(null);
        await fetchQuestionnaires();
      } else {
        setToast({
          message: res.error || "Gagal menghapus kuesioner.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat menghapus kuesioner.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Questionnaire) => {
    setEditingQuestionnaire(item);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setEditingQuestionnaire(null);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setEditingQuestionnaire(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleManageQuestions = (item: Questionnaire) => {
    navigate(`/surveys/questionnaire/${item.id}/questions`);
  };

  const handleManageSubmissions = (item: Questionnaire) => {
    navigate(`/surveys/questionnaire/${item.id}/mahasiswas`);
  };

  onMount(fetchQuestionnaires);

  return {
    questionnaires,
    isLoading,
    error,
    editingQuestionnaire,
    showForm,
    deletingId,
    toast,
    clearToast,
    handleSubmit,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm,
    handleManageQuestions,
    handleManageSubmissions,
    setDeletingId,
    fetchQuestionnaires,
  };
};
