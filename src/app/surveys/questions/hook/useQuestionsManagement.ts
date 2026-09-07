import { createSignal, onMount } from "solid-js";
import { questionsAPI } from "../service/questions.api";
import { questionnaireAPI } from "../../questionnaire/service/questionnaire.api";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../type/questions";
import type { Questionnaire } from "../../questionnaire/type/questionnaire";

export const useQuestionsManagement = () => {
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [questionnaires, setQuestionnaires] = createSignal<Questionnaire[]>([]);
  const [selectedQuestionnaireFilter, setSelectedQuestionnaireFilter] =
    createSignal<string>("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingQuestion, setEditingQuestion] = createSignal<Question | null>(
    null,
  );
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const fetchQuestions = async (qId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const filterId = qId !== undefined ? qId : selectedQuestionnaireFilter();
      const res = await questionsAPI.getAll(filterId || undefined);
      if (res.success && res.data) {
        setQuestions(res.data);
      } else {
        setError(res.error || "Gagal memuat pertanyaan.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      const res = await questionnaireAPI.getAll();
      if (res.success && res.data) {
        setQuestionnaires(res.data);
      }
    } catch {}
  };

  const handleFilterChange = async (qId: string) => {
    setSelectedQuestionnaireFilter(qId);
    await fetchQuestions(qId);
  };

  const handleSubmit = async (
    data: CreateQuestionInput | UpdateQuestionInput,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingQuestion();
      let res;
      if (editing) {
        res = await questionsAPI.update(editing.id, data);
      } else {
        res = await questionsAPI.create(data as CreateQuestionInput);
      }

      if (res.success) {
        setToast({
          message: editing
            ? "Pertanyaan berhasil diperbarui!"
            : "Pertanyaan berhasil ditambahkan!",
          type: "success",
        });
        closeForm();
        await fetchQuestions();
      } else {
        setError(res.error || "Gagal menyimpan pertanyaan.");
        setToast({
          message: res.error || "Gagal menyimpan pertanyaan.",
          type: "error",
        });
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan pertanyaan.");
      setToast({
        message: "Terjadi kesalahan saat menyimpan pertanyaan.",
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
      const res = await questionsAPI.delete(id);
      if (res.success) {
        setToast({
          message: "Pertanyaan berhasil dihapus!",
          type: "success",
        });
        setDeletingId(null);
        await fetchQuestions();
      } else {
        setToast({
          message: res.error || "Gagal menghapus pertanyaan.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat menghapus pertanyaan.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Question) => {
    setEditingQuestion(item);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setEditingQuestion(null);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setEditingQuestion(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  onMount(() => {
    fetchQuestionnaires();
    fetchQuestions();
  });

  return {
    questions,
    questionnaires,
    selectedQuestionnaireFilter,
    isLoading,
    error,
    editingQuestion,
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
    handleFilterChange,
    setDeletingId,
    fetchQuestions,
  };
};
