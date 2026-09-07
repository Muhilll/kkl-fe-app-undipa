import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import { useAuth } from "../../../services/authStore";
import { susAPI } from "../service/sus.api";
import { calculateSusScore } from "../utils/susCalculator";
import type { Question } from "../../surveys/questions/type/questions";
import type {
  MahasiswaQuestionnaireAnswer,
  Questionnaire,
} from "../../surveys/questionnaire/type/questionnaire";
import type { Mahasiswa } from "../../master-data/mahasiswa/type/mahasiswa";
import type { SusScoreCalculation } from "../type/sus";

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
  const [susScoreData, setSusScoreData] =
    createSignal<SusScoreCalculation | null>(null);

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

  // Initial load
  onMount(async () => {
    await initData();
  });

  const initData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [qnRes, mhsRes] = await Promise.all([
        susAPI.getQuestionnaires(),
        susAPI.getAllMahasiswas(),
      ]);

      const qnList = qnRes.data || [];
      const mhsList = mhsRes.data || [];

      setQuestionnaires(qnList);

      // Find current mahasiswa based on authenticated user
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
      // Matched student record from logged-in user
      setCurrentMahasiswa(matchedMhs);

      // Automatically select questionnaire matching 'usability' or 'sus' or default to first
      const defaultQn =
        qnList.find(
          (q) =>
            q.name.toLowerCase().includes("usability") ||
            q.name.toLowerCase().includes("sus"),
        ) || qnList[0];

      if (defaultQn) {
        setSelectedQuestionnaireId(String(defaultQn.id));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data awal survei.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Re-check questionnaire questions & submissions whenever questionnaire or currentMahasiswa changes
  createEffect(() => {
    const qnId = selectedQuestionnaireId();
    const mhs = activeMahasiswa();

    if (qnId) {
      checkSubmissionStatus(qnId, mhs ? mhs.id : null);
    }
  });

  const checkSubmissionStatus = async (
    qnId: string,
    mahasiswaId: number | null,
  ) => {
    setIsLoading(true);

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
          // Calculate SUS Score
          const scoreCalc = calculateSusScore(subList);
          setSusScoreData(scoreCalc);
        } else {
          setHasSubmitted(false);
          setSusScoreData(null);
          setUserAnswers({});
        }
      } else {
        setHasSubmitted(false);
        setSubmissions([]);
        setSusScoreData(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memeriksa status evaluasi mahasiswa.",
      );
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
        await checkSubmissionStatus(selectedQuestionnaireId(), mhs.id);
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

  const handleResetEvaluation = async () => {
    const mhs = activeMahasiswa();
    const qnId = selectedQuestionnaireId();
    if (!mhs || !qnId) return;

    setIsSubmitting(true);
    try {
      const res = await susAPI.resetStudentSubmissions(qnId, mhs.id);
      if (res.success) {
        setToast({
          message:
            "Pengisian kuesioner direset. Anda dapat mengisi kembali.",
          type: "success",
        });
        await checkSubmissionStatus(qnId, mhs.id);
      } else {
        setToast({
          message: res.error || "Gagal mereset jawaban kuesioner.",
          type: "error",
        });
      }
    } catch (err) {
      setToast({
        message: "Terjadi kesalahan saat mereset kuesioner.",
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
    selectedQuestionnaire,
    questions,
    currentMahasiswa,
    activeMahasiswa,
    hasSubmitted,
    submissions,
    susScoreData,
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
    handleResetEvaluation,
  };
}
