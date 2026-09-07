import { createMemo, createSignal, onMount } from "solid-js";
import { useAuth } from "../../../services/authStore";
import { susAPI } from "../service/sus.api";
import type { Question } from "../../surveys/questions/type/questions";
import type {
  MahasiswaQuestionnaireAnswer,
  Questionnaire,
} from "../../surveys/questionnaire/type/questionnaire";
import type { Mahasiswa } from "../../master-data/mahasiswa/type/mahasiswa";

export function useSusKklApp() {
  const auth = useAuth();

  const [questionnaires, setQuestionnaires] = createSignal<Questionnaire[]>([]);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] =
    createSignal<string>("");
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [currentMahasiswa, setCurrentMahasiswa] =
    createSignal<Mahasiswa | null>(null);

  const [hasSubmitted, setHasSubmitted] = createSignal(false);
  const [submissions, setSubmissions] = createSignal<
    MahasiswaQuestionnaireAnswer[]
  >([]);

  const [userAnswers, setUserAnswers] = createSignal<Record<number, number>>(
    {},
  );
  const [isLoading, setIsLoading] = createSignal(true);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const activeMahasiswa = () => currentMahasiswa();

  const selectedQuestionnaire = createMemo(() => {
    return (
      questionnaires().find(
        (q) => String(q.id) === selectedQuestionnaireId(),
      ) || null
    );
  });

  // Check progress: count answered questions
  const answeredCount = createMemo(() => {
    const ans = userAnswers();
    return questions().filter((q) => ans[q.id] !== undefined).length;
  });

  const totalQuestionsCount = createMemo(() => questions().length);
  const isAllAnswered = createMemo(
    () =>
      totalQuestionsCount() > 0 &&
      answeredCount() === totalQuestionsCount(),
  );

  const progressPercentage = createMemo(() => {
    if (totalQuestionsCount() === 0) return 0;
    return Math.round((answeredCount() / totalQuestionsCount()) * 100);
  });

  // Initial unified load
  onMount(async () => {
    await initData();
  });

  const initData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 1. Fetch questionnaires and all mahasiswas in parallel
      const [qnRes, mhsRes] = await Promise.all([
        susAPI.getQuestionnaires(),
        susAPI.getAllMahasiswas(),
      ]);

      const qnList = qnRes.data || [];
      const mhsList = mhsRes.data || [];
      setQuestionnaires(qnList);

      // 2. Find current mahasiswa based on authenticated user
      const user = auth.user();
      let matchedMhs: Mahasiswa | null = null;
      if (user) {
        matchedMhs =
          mhsList.find(
            (m) =>
              Number(m.user_id) === Number(user.id) ||
              m.nim === user.username,
          ) || null;
      }
      setCurrentMahasiswa(matchedMhs);

      // 3. Automatically select questionnaire matching 'usability' or 'sus' or default to first
      const defaultQn =
        qnList.find(
          (q) =>
            q.name.toLowerCase().includes("usability") ||
            q.name.toLowerCase().includes("sus"),
        ) || qnList[0];

      if (defaultQn) {
        const qnId = String(defaultQn.id);
        setSelectedQuestionnaireId(qnId);
        // Load questions and submissions in the SAME initial loading step
        await loadQuestionnaireData(qnId, matchedMhs ? matchedMhs.id : null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data awal kuesioner.",
      );
    } finally {
      // Only release loading state when questionnaires, questions, AND submissions are fully ready
      setIsLoading(false);
    }
  };

  const loadQuestionnaireData = async (
    qnId: string,
    mahasiswaId: number | null,
  ) => {
    try {
      // 1. Fetch questions for this questionnaire
      const qRes = await susAPI.getQuestions(qnId);
      const qList = qRes.data || [];
      setQuestions(qList);

      // 2. If student exists, check if they already submitted
      if (mahasiswaId) {
        const subRes = await susAPI.getStudentSubmissions(qnId, mahasiswaId);
        const subList = subRes.data || [];
        setSubmissions(subList);

        if (subList.length > 0) {
          setHasSubmitted(true);
        } else {
          setHasSubmitted(false);
          setUserAnswers({});
        }
      } else {
        setHasSubmitted(false);
        setSubmissions([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memeriksa status kuesioner mahasiswa.",
      );
    }
  };

  const handleSelectQuestionnaire = async (qnId: string) => {
    setSelectedQuestionnaireId(qnId);
    setIsLoading(true);
    try {
      const mhs = activeMahasiswa();
      await loadQuestionnaireData(qnId, mhs ? mhs.id : null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: number, score: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: score,
    }));
  };

  const handleSubmitEvaluation = async () => {
    const mhs = activeMahasiswa();
    if (!mhs) {
      setToast({
        message: "Data identitas mahasiswa Anda tidak ditemukan.",
        type: "error",
      });
      return;
    }

    if (!isAllAnswered()) {
      setToast({
        message: `Masih ada ${totalQuestionsCount() - answeredCount()} butir pertanyaan yang belum Anda jawab. Silakan lengkapi seluruh pertanyaan.`,
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const answersPayload = questions().map((q) => ({
        question_id: q.id,
        score: userAnswers()[q.id] || 3,
      }));

      // Directly send mahasiswa.id from logged-in student
      const res = await susAPI.submitBatch(mhs.id, answersPayload);
      if (res.success) {
        setToast({
          message:
            "Terima kasih! Jawaban evaluasi kuesioner Anda berhasil dikirim.",
          type: "success",
        });
        // Refresh submission status
        await loadQuestionnaireData(selectedQuestionnaireId(), mhs.id);
      } else {
        setToast({
          message: res.error || "Gagal mengirimkan jawaban evaluasi.",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengirim jawaban.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questionnaires,
    selectedQuestionnaireId,
    setSelectedQuestionnaireId,
    handleSelectQuestionnaire,
    selectedQuestionnaire,
    questions,
    currentMahasiswa,
    activeMahasiswa,
    hasSubmitted,
    submissions,
    userAnswers,
    handleSelectAnswer,
    answeredCount,
    totalQuestionsCount,
    isAllAnswered,
    progressPercentage,
    isLoading,
    isSubmitting,
    error,
    toast,
    clearToast,
    handleSubmitEvaluation,
  };
}
