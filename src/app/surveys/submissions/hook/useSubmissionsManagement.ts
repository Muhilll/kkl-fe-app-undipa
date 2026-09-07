import { createSignal, onMount } from "solid-js";
import { submissionsAPI } from "../service/submissions.api";
import { questionnaireAPI } from "../../questionnaire/service/questionnaire.api";
import { questionsAPI } from "../../questions/service/questions.api";
import { mahasiswaAPI } from "../../../master-data/mahasiswa/service/mahasiswa.api";
import type {
  CreateSubmissionInput,
  Submission,
  UpdateSubmissionInput,
} from "../type/submissions";
import type { Questionnaire } from "../../questionnaire/type/questionnaire";
import type { Question } from "../../questions/type/questions";

export const useSubmissionsManagement = () => {
  const [submissions, setSubmissions] = createSignal<Submission[]>([]);
  const [questionnaires, setQuestionnaires] = createSignal<Questionnaire[]>([]);
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [mahasiswas, setMahasiswas] = createSignal<any[]>([]);

  // Filter signals
  const [selectedQuestionnaireFilter, setSelectedQuestionnaireFilter] =
    createSignal<string>("");
  const [selectedMahasiswaFilter, setSelectedMahasiswaFilter] =
    createSignal<string>("");

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingSubmission, setEditingSubmission] =
    createSignal<Submission | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await submissionsAPI.getAll({
        questionnaire_id: selectedQuestionnaireFilter() || undefined,
        mahasiswa_id: selectedMahasiswaFilter() || undefined,
      });
      if (res.success && res.data) {
        setSubmissions(res.data);
      } else {
        setError(res.error || "Gagal memuat data jawaban.");
      }
    } catch {
      setError("Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [qRes, qsRes, mhsRes] = await Promise.all([
        questionnaireAPI.getAll(),
        questionsAPI.getAll(),
        mahasiswaAPI.getAll(),
      ]);

      if (qRes.success && qRes.data) setQuestionnaires(qRes.data);
      if (qsRes.success && qsRes.data) setQuestions(qsRes.data);
      if (mhsRes.success && mhsRes.data) setMahasiswas(mhsRes.data);
    } catch {}
  };

  const handleFilterChange = async (qId: string, mId: string) => {
    setSelectedQuestionnaireFilter(qId);
    setSelectedMahasiswaFilter(mId);
    await fetchSubmissions();
  };

  const handleSubmit = async (
    data: CreateSubmissionInput | UpdateSubmissionInput,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingSubmission();
      let res;
      if (editing) {
        res = await submissionsAPI.update(editing.id, data);
      } else {
        res = await submissionsAPI.create(data as CreateSubmissionInput);
      }

      if (res.success) {
        setToast({
          message: editing
            ? "Jawaban berhasil diperbarui!"
            : "Jawaban berhasil disimpan!",
          type: "success",
        });
        closeForm();
        await fetchSubmissions();
      } else {
        setError(res.error || "Gagal menyimpan jawaban.");
        setToast({
          message: res.error || "Gagal menyimpan jawaban.",
          type: "error",
        });
      }
    } catch {
      setError("Terjadi kesalahan saat menyimpan jawaban.");
      setToast({
        message: "Terjadi kesalahan saat menyimpan jawaban.",
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
      const res = await submissionsAPI.delete(id);
      if (res.success) {
        setToast({
          message: "Data jawaban berhasil dihapus!",
          type: "success",
        });
        setDeletingId(null);
        await fetchSubmissions();
      } else {
        setToast({
          message: res.error || "Gagal menghapus data.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat menghapus data.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: Submission) => {
    setEditingSubmission(item);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setEditingSubmission(null);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setEditingSubmission(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingId(id);
  };

  onMount(() => {
    fetchDependencies();
    fetchSubmissions();
  });

  return {
    submissions,
    questionnaires,
    questions,
    mahasiswas,
    selectedQuestionnaireFilter,
    selectedMahasiswaFilter,
    isLoading,
    error,
    editingSubmission,
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
    fetchSubmissions,
  };
};
