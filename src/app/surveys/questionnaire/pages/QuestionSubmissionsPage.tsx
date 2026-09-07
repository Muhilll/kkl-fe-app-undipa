import {
  Component,
  createEffect,
  createSignal,
  For,
  Show,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import DataTable, { type DataTableColumn } from "../../../../components/ui/DataTable";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { questionsAPI } from "../../questions/service/questions.api";
import { submissionsAPI } from "../../submissions/service/submissions.api";
import { mahasiswaAPI } from "../../../master-data/mahasiswa/service/mahasiswa.api";
import type {
  Question,
  QuestionSubmission,
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

const QuestionSubmissionsPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const questionnaireId = Number(params.id);
  const questionId = Number(params.questionId);
  const permissions = usePagePermissions();

  const [question, setQuestion] = createSignal<Question | null>(null);
  const [submissions, setSubmissions] = createSignal<QuestionSubmission[]>([]);
  const [mahasiswas, setMahasiswas] = createSignal<any[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [editingSubmission, setEditingSubmission] =
    createSignal<QuestionSubmission | null>(null);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form signals
  const [selectedMahasiswaId, setSelectedMahasiswaId] = createSignal("");
  const [selectedScore, setSelectedScore] = createSignal(5);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [qRes, subRes, mhsRes] = await Promise.all([
        questionsAPI.getById(questionId),
        questionsAPI.getSubmissions(questionId),
        mahasiswaAPI.getAll(),
      ]);

      if (qRes.success && qRes.data) {
        setQuestion(qRes.data);
      } else {
        setError("Pertanyaan tidak ditemukan.");
      }

      if (subRes.success && subRes.data) {
        setSubmissions(subRes.data);
      }

      if (mhsRes.success && mhsRes.data) {
        setMahasiswas(mhsRes.data);
      }
    } catch {
      setError("Gagal memuat data jawaban.");
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const openCreateForm = () => {
    setEditingSubmission(null);
    setSelectedMahasiswaId("");
    setSelectedScore(5);
    setShowForm(true);
  };

  const openEditForm = (sub: QuestionSubmission) => {
    setEditingSubmission(sub);
    setSelectedMahasiswaId(String(sub.mahasiswa_id));
    setSelectedScore(sub.score);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSubmission(null);
  };

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
    if (!selectedMahasiswaId()) {
      setToast({ message: "Pilih mahasiswa terlebih dahulu!", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const editing = editingSubmission();
      let res;
      if (editing) {
        res = await submissionsAPI.update(editing.id, {
          score: Number(selectedScore()),
        });
      } else {
        res = await submissionsAPI.create({
          question_id: questionId,
          mahasiswa_id: Number(selectedMahasiswaId()),
          score: Number(selectedScore()),
        });
      }

      if (res.success) {
        setToast({
          message: editing
            ? "Jawaban berhasil diperbarui!"
            : "Jawaban berhasil disimpan!",
          type: "success",
        });
        closeForm();
        await fetchData();
      } else {
        setToast({
          message: res.error || "Gagal menyimpan jawaban.",
          type: "error",
        });
      }
    } catch {
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
        await fetchData();
      } else {
        setToast({
          message: res.error || "Gagal menghapus jawaban.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat menghapus jawaban.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionText = (scoreValue: number) => {
    const q = question();
    if (!q) return `Skor ${scoreValue}`;
    switch (scoreValue) {
      case 1:
        return `1 - ${q.options_one}`;
      case 2:
        return `2 - ${q.options_two}`;
      case 3:
        return `3 - ${q.options_three}`;
      case 4:
        return `4 - ${q.options_four}`;
      case 5:
        return `5 - ${q.options_five}`;
      default:
        return `Skor ${scoreValue}`;
    }
  };

  const columns: DataTableColumn<QuestionSubmission>[] = [
    {
      header: "No",
      cell: (_: any, index: number) => <>{index + 1}</>,
      sortValue: (s: QuestionSubmission) => s.id,
    },
    {
      header: "Mahasiswa",
      cell: (s: QuestionSubmission) => (
        <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
          <span style={{ "font-weight": "500" }}>{s.mahasiswa_nama}</span>
          <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
            NIM: {s.mahasiswa_nim}
          </span>
        </div>
      ),
      sortValue: (s: QuestionSubmission) => s.mahasiswa_nama,
    },
    {
      header: "Jurusan",
      cell: (s: QuestionSubmission) => <>{s.jurusan_nama || "-"}</>,
      sortValue: (s: QuestionSubmission) => s.jurusan_nama || "",
    },
    {
      header: "Jawaban / Skor",
      cell: (s: QuestionSubmission) => (
        <span
          style={{
            padding: "3px 8px",
            "background-color": "var(--emerald-50, #ecfdf5)",
            color: "var(--emerald-700, #047857)",
            "border-radius": "10px",
            "font-size": "12px",
            "font-weight": "600",
          }}
        >
          {getOptionText(s.score)}
        </span>
      ),
      sortValue: (s: QuestionSubmission) => s.score,
    },
    {
      header: "Tanggal Submit",
      cell: (s: QuestionSubmission) => (
        <span style={{ "font-size": "12px", color: "var(--gray-600)" }}>
          {new Date(s.created_at).toLocaleString("id-ID")}
        </span>
      ),
      sortValue: (s: QuestionSubmission) => s.created_at,
    },
    {
      header: "Actions",
      sortable: false,
      headerStyle: { "text-align": "right" as const },
      cellClass: "td-actions",
      cell: (s: QuestionSubmission) => (
        <div class="action-btns">
          {permissions.canUpdate() && (
            <button
              class="btn-icon btn-edit"
              title="Edit Jawaban"
              onClick={() => openEditForm(s)}
            >
              <IconEdit />
            </button>
          )}
          {permissions.canDelete() && (
            <button
              class="btn-icon btn-delete"
              title="Hapus Jawaban"
              onClick={() => setDeletingId(String(s.id))}
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
        title={`Jawaban untuk Pertanyaan #${question()?.id || ""}`}
        description={
          question()?.question || "Daftar respons mahasiswa untuk butir soal ini."
        }
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              class="btn-secondary"
              onClick={() =>
                navigate(
                  `/surveys/questionnaire/${questionnaireId}/questions`,
                )
              }
            >
              <IconArrowLeft />
              Kembali ke Pertanyaan
            </button>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={openCreateForm}>
                <IconPlusCircle />
                Tambah Jawaban
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
              {editingSubmission()
                ? "Edit Jawaban Mahasiswa"
                : "Input Jawaban Mahasiswa"}
            </h2>
            <button onClick={closeForm} class="btn-secondary" type="button">
              Batal
            </button>
          </div>
          <form onSubmit={handleFormSubmit} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="mahasiswa">
                Pilih Mahasiswa <span class="required">*</span>
              </label>
              <select
                id="mahasiswa"
                class="form-select"
                value={selectedMahasiswaId()}
                onChange={(e) => setSelectedMahasiswaId(e.currentTarget.value)}
                disabled={!!editingSubmission() || isLoading()}
                required
              >
                <option value="">-- Pilih Mahasiswa --</option>
                <For each={mahasiswas()}>
                  {(m) => (
                    <option value={m.id}>
                      {m.nama} ({m.nim})
                    </option>
                  )}
                </For>
              </select>
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="score">
                Pilihan Jawaban / Skor <span class="required">*</span>
              </label>
              <select
                id="score"
                class="form-select"
                value={selectedScore()}
                onChange={(e) => setSelectedScore(Number(e.currentTarget.value))}
                required
                disabled={isLoading()}
              >
                <option value={1}>{getOptionText(1)}</option>
                <option value={2}>{getOptionText(2)}</option>
                <option value={3}>{getOptionText(3)}</option>
                <option value={4}>{getOptionText(4)}</option>
                <option value={5}>{getOptionText(5)}</option>
              </select>
            </div>

            <button
              type="submit"
              class="btn-submit"
              disabled={isLoading()}
            >
              {isLoading()
                ? "Menyimpan..."
                : editingSubmission()
                  ? "Perbarui Jawaban"
                  : "Simpan Jawaban"}
            </button>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Hapus Jawaban"
        message="Apakah Anda yakin ingin menghapus data jawaban mahasiswa ini?"
        confirmLabel={isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <DataTable
        rows={submissions()}
        columns={columns}
        isLoading={isLoading()}
        emptyMessage="Belum ada jawaban mahasiswa untuk pertanyaan ini."
        itemsPerPage={10}
      />
    </div>
  );
};

export default QuestionSubmissionsPage;
