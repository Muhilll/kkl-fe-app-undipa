import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import DataTable, { type DataTableColumn } from "../../../../components/ui/DataTable";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { questionnaireAPI } from "../service/questionnaire.api";
import { questionsAPI } from "../../questions/service/questions.api";
import type { Questionnaire } from "../type/questionnaire";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../../questions/type/questions";

const IconPlusCircle = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconArrowLeft = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconEye = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEdit = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const QuestionnaireQuestionsPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const questionnaireId = Number(params.id);
  const permissions = usePagePermissions();

  const [questionnaire, setQuestionnaire] =
    createSignal<Questionnaire | null>(null);
  const [questions, setQuestions] = createSignal<Question[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [editingQuestion, setEditingQuestion] = createSignal<Question | null>(null);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form signals
  const [questionText, setQuestionText] = createSignal("");
  const [optOne, setOptOne] = createSignal("");
  const [optTwo, setOptTwo] = createSignal("");
  const [optThree, setOptThree] = createSignal("");
  const [optFour, setOptFour] = createSignal("");
  const [optFive, setOptFive] = createSignal("");
  const [score, setScore] = createSignal(5);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [qRes, questionsRes] = await Promise.all([
        questionnaireAPI.getById(questionnaireId),
        questionnaireAPI.getQuestions(questionnaireId),
      ]);

      if (qRes.success && qRes.data) {
        setQuestionnaire(qRes.data);
      } else {
        setError("Kuesioner tidak ditemukan.");
      }

      if (questionsRes.success && questionsRes.data) {
        setQuestions(questionsRes.data);
      }
    } catch {
      setError("Gagal memuat data pertanyaan.");
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const openCreateForm = () => {
    setEditingQuestion(null);
    setQuestionText("");
    setOptOne("Sangat Tidak Setuju");
    setOptTwo("Tidak Setuju");
    setOptThree("Ragu-ragu / Cukup");
    setOptFour("Setuju");
    setOptFive("Sangat Setuju");
    setScore(5);
    setShowForm(true);
  };

  const openEditForm = (q: Question) => {
    setEditingQuestion(q);
    setQuestionText(q.question);
    setOptOne(q.options_one);
    setOptTwo(q.options_two);
    setOptThree(q.options_three);
    setOptFour(q.options_four);
    setOptFive(q.options_five);
    setScore(q.score);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: CreateQuestionInput = {
        questionnaire_id: questionnaireId,
        question: questionText(),
        options_one: optOne(),
        options_two: optTwo(),
        options_three: optThree(),
        options_four: optFour(),
        options_five: optFive(),
        score: Number(score()),
      };

      const editing = editingQuestion();
      let res;
      if (editing) {
        res = await questionsAPI.update(editing.id, payload);
      } else {
        res = await questionsAPI.create(payload);
      }

      if (res.success) {
        setToast({
          message: editing
            ? "Pertanyaan berhasil diperbarui!"
            : "Pertanyaan baru berhasil ditambahkan!",
          type: "success",
        });
        closeForm();
        await fetchData();
      } else {
        setToast({
          message: res.error || "Gagal menyimpan pertanyaan.",
          type: "error",
        });
      }
    } catch {
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
        await fetchData();
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

  const columns: DataTableColumn<Question>[] = [
    {
      header: "No",
      cell: (_: any, index: number) => <>{index + 1}</>,
      sortValue: (q: Question) => q.id,
    },
    {
      header: "Pertanyaan",
      cell: (q: Question) => (
        <span style={{ "font-weight": "500" }}>{q.question}</span>
      ),
      sortValue: (q: Question) => q.question,
    },
    {
      header: "Pilihan Opsi 1 s/d 5",
      cell: (q: Question) => (
        <div style={{ "font-size": "12px", color: "var(--gray-600)" }}>
          <div>1. {q.options_one}</div>
          <div>2. {q.options_two}</div>
          <div>3. {q.options_three}</div>
          <div>4. {q.options_four}</div>
          <div>5. {q.options_five}</div>
        </div>
      ),
    },
    {
      header: "Skor/Bobot",
      cell: (q: Question) => (
        <span
          style={{
            padding: "2px 8px",
            "background-color": "var(--purple-50, #faf5ff)",
            color: "var(--purple-700, #7e22ce)",
            "border-radius": "10px",
            "font-size": "12px",
            "font-weight": "600",
          }}
        >
          {q.score} Poin
        </span>
      ),
      sortValue: (q: Question) => q.score,
    },
    {
      header: "Actions",
      sortable: false,
      headerStyle: { "text-align": "right" as const },
      cellClass: "td-actions",
      cell: (q: Question) => (
        <div class="action-btns">
          <button
            class="btn-icon"
            style={{ color: "var(--blue-600, #2563eb)" }}
            title="Lihat Semua Jawaban Mahasiswa untuk Pertanyaan Ini"
            onClick={() =>
              navigate(
                `/surveys/questionnaire/${questionnaireId}/questions/${q.id}/submissions`,
              )
            }
          >
            <IconEye />
          </button>
          {permissions.canUpdate() && (
            <button
              class="btn-icon btn-edit"
              title="Edit Pertanyaan"
              onClick={() => openEditForm(q)}
            >
              <IconEdit />
            </button>
          )}
          {permissions.canDelete() && (
            <button
              class="btn-icon btn-delete"
              title="Hapus Pertanyaan"
              onClick={() => setDeletingId(String(q.id))}
            >
              <IconTrash />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title={`Daftar Pertanyaan: ${questionnaire()?.name || "Kuesioner"}`}
        description={
          questionnaire()?.desc ||
          "Kelola daftar butir pertanyaan untuk kuesioner ini."
        }
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              class="btn-secondary"
              onClick={() => navigate("/surveys/questionnaire")}
            >
              <IconArrowLeft />
              Kembali ke Kuesioner
            </button>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={openCreateForm}>
                <IconPlusCircle />
                Tambah Pertanyaan
              </button>
            </Show>
          </div>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {editingQuestion()
                ? "Edit Pertanyaan"
                : "Tambah Pertanyaan Baru"}
            </h2>
            <button onClick={closeForm} class="btn-secondary" type="button">
              Batal
            </button>
          </div>
          <form onSubmit={handleFormSubmit} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="question">
                Butir Pertanyaan <span class="required">*</span>
              </label>
              <textarea
                id="question"
                class="form-textarea"
                rows={3}
                value={questionText()}
                onInput={(e) => setQuestionText(e.currentTarget.value)}
                placeholder="Tuliskan butir pertanyaan survei..."
                required
                disabled={isLoading()}
              />
            </div>

            <div
              style={{
                "grid-column": "1 / -1",
                display: "flex",
                "flex-direction": "column",
                gap: "12px",
                background: "var(--gray-50)",
                padding: "16px",
                "border-radius": "8px",
                border: "1px solid var(--gray-200)",
              }}
            >
              <span
                style={{
                  "font-size": "11px",
                  "font-weight": "700",
                  "letter-spacing": "0.07em",
                  "text-transform": "uppercase",
                  color: "var(--gray-500)",
                }}
              >
                Label Opsi Jawaban (Skala 1 - 5)
              </span>

              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                }}
              >
                <div class="form-group">
                  <label for="optOne">Opsi 1 (Skor 1) *</label>
                  <input
                    id="optOne"
                    type="text"
                    value={optOne()}
                    onInput={(e) => setOptOne(e.currentTarget.value)}
                    placeholder="Contoh: Sangat Tidak Setuju"
                    required
                    disabled={isLoading()}
                  />
                </div>
                <div class="form-group">
                  <label for="optTwo">Opsi 2 (Skor 2) *</label>
                  <input
                    id="optTwo"
                    type="text"
                    value={optTwo()}
                    onInput={(e) => setOptTwo(e.currentTarget.value)}
                    placeholder="Contoh: Tidak Setuju"
                    required
                    disabled={isLoading()}
                  />
                </div>
                <div class="form-group">
                  <label for="optThree">Opsi 3 (Skor 3) *</label>
                  <input
                    id="optThree"
                    type="text"
                    value={optThree()}
                    onInput={(e) => setOptThree(e.currentTarget.value)}
                    placeholder="Contoh: Cukup / Netral"
                    required
                    disabled={isLoading()}
                  />
                </div>
                <div class="form-group">
                  <label for="optFour">Opsi 4 (Skor 4) *</label>
                  <input
                    id="optFour"
                    type="text"
                    value={optFour()}
                    onInput={(e) => setOptFour(e.currentTarget.value)}
                    placeholder="Contoh: Setuju"
                    required
                    disabled={isLoading()}
                  />
                </div>
                <div class="form-group">
                  <label for="optFive">Opsi 5 (Skor 5) *</label>
                  <input
                    id="optFive"
                    type="text"
                    value={optFive()}
                    onInput={(e) => setOptFive(e.currentTarget.value)}
                    placeholder="Contoh: Sangat Setuju"
                    required
                    disabled={isLoading()}
                  />
                </div>
              </div>
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="score">
                Skor Maksimal / Bobot <span class="required">*</span>
              </label>
              <input
                id="score"
                type="number"
                min={1}
                value={score()}
                onInput={(e) => setScore(Number(e.currentTarget.value))}
                required
                disabled={isLoading()}
              />
            </div>

            <button
              type="submit"
              class="btn-submit"
              disabled={isLoading()}
            >
              {isLoading()
                ? "Menyimpan..."
                : editingQuestion()
                  ? "Perbarui Pertanyaan"
                  : "Simpan Pertanyaan"}
            </button>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Hapus Pertanyaan"
        message="Apakah Anda yakin ingin menghapus pertanyaan ini? Seluruh jawaban mahasiswa pada pertanyaan ini juga akan terhapus."
        confirmLabel={isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <DataTable
        rows={questions()}
        columns={columns}
        isLoading={isLoading()}
        emptyMessage="Belum ada pertanyaan pada kuesioner ini."
        itemsPerPage={10}
      />
    </div>
  );
};

export default QuestionnaireQuestionsPage;
