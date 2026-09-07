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
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { questionnaireAPI } from "../service/questionnaire.api";
import { submissionsAPI } from "../../submissions/service/submissions.api";
import { mahasiswaAPI } from "../../../master-data/mahasiswa/service/mahasiswa.api";
import type {
  MahasiswaQuestionnaireAnswer,
  Questionnaire,
} from "../type/questionnaire";

const IconArrowLeft = () => (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconPrinter = () => (
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
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
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

const MahasiswaSubmissionsPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const questionnaireId = Number(params.id);
  const mahasiswaId = Number(params.mahasiswaId);
  const permissions = usePagePermissions();

  const [questionnaire, setQuestionnaire] =
    createSignal<Questionnaire | null>(null);
  const [mahasiswa, setMahasiswa] = createSignal<any | null>(null);
  const [answers, setAnswers] = createSignal<MahasiswaQuestionnaireAnswer[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [editingAnswer, setEditingAnswer] =
    createSignal<MahasiswaQuestionnaireAnswer | null>(null);
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [selectedScore, setSelectedScore] = createSignal(5);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [qRes, ansRes, mhsRes] = await Promise.all([
        questionnaireAPI.getById(questionnaireId),
        questionnaireAPI.getMahasiswaSubmissions(questionnaireId, mahasiswaId),
        mahasiswaAPI.getById(String(mahasiswaId)),
      ]);

      if (qRes.success && qRes.data) {
        setQuestionnaire(qRes.data);
      }
      if (ansRes.success && ansRes.data) {
        setAnswers(ansRes.data);
      }
      if (mhsRes.success && mhsRes.data) {
        setMahasiswa(mhsRes.data);
      }
    } catch {
      setError("Gagal memuat rincian jawaban mahasiswa.");
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const openEditModal = (ans: MahasiswaQuestionnaireAnswer) => {
    setEditingAnswer(ans);
    setSelectedScore(ans.score);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingAnswer(null);
  };

  const handleEditSubmit = async (e: Event) => {
    e.preventDefault();
    const editing = editingAnswer();
    if (!editing) return;

    setIsLoading(true);
    try {
      const res = await submissionsAPI.update(editing.id, {
        score: Number(selectedScore()),
      });

      if (res.success) {
        setToast({
          message: "Jawaban berhasil diperbarui!",
          type: "success",
        });
        closeEditModal();
        await fetchData();
      } else {
        setToast({
          message: res.error || "Gagal memperbarui jawaban.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat memperbarui jawaban.",
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
          message: "Jawaban butir ini berhasil dihapus!",
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

  const getOptionLabel = (ans: MahasiswaQuestionnaireAnswer, score: number) => {
    switch (score) {
      case 1:
        return `1 - ${ans.options_one}`;
      case 2:
        return `2 - ${ans.options_two}`;
      case 3:
        return `3 - ${ans.options_three}`;
      case 4:
        return `4 - ${ans.options_four}`;
      case 5:
        return `5 - ${ans.options_five}`;
      default:
        return `Skor ${score}`;
    }
  };

  const columns: DataTableColumn<MahasiswaQuestionnaireAnswer>[] = [
    {
      header: "No",
      cell: (_: any, index: number) => <>{index + 1}</>,
      sortValue: (a: MahasiswaQuestionnaireAnswer) => a.id,
    },
    {
      header: "Pertanyaan",
      cell: (a: MahasiswaQuestionnaireAnswer) => (
        <span style={{ "font-weight": "500" }}>{a.question}</span>
      ),
      sortValue: (a: MahasiswaQuestionnaireAnswer) => a.question,
    },
    {
      header: "Jawaban yang Dipilih",
      cell: (a: MahasiswaQuestionnaireAnswer) => (
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
          {getOptionLabel(a, a.score)}
        </span>
      ),
      sortValue: (a: MahasiswaQuestionnaireAnswer) => a.score,
    },
    {
      header: "Skor",
      cell: (a: MahasiswaQuestionnaireAnswer) => (
        <span style={{ "font-weight": "600" }}>{a.score} Poin</span>
      ),
      sortValue: (a: MahasiswaQuestionnaireAnswer) => a.score,
    },
    {
      header: "Tanggal Submit",
      cell: (a: MahasiswaQuestionnaireAnswer) => (
        <span style={{ "font-size": "12px", color: "var(--gray-600)" }}>
          {new Date(a.created_at).toLocaleString("id-ID")}
        </span>
      ),
      sortValue: (a: MahasiswaQuestionnaireAnswer) => a.created_at,
    },
    {
      header: "Actions",
      sortable: false,
      headerStyle: { "text-align": "right" as const },
      cellClass: "td-actions",
      cell: (a: MahasiswaQuestionnaireAnswer) => (
        <div class="action-btns">
          {permissions.canUpdate() && (
            <button
              class="btn-icon btn-edit"
              title="Koreksi Jawaban"
              onClick={() => openEditModal(a)}
            >
              <IconEdit />
            </button>
          )}
          {permissions.canDelete() && (
            <button
              class="btn-icon btn-delete"
              title="Hapus Jawaban Butir Ini"
              onClick={() => setDeletingId(String(a.id))}
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
        title={`Jawaban Mahasiswa: ${mahasiswa()?.nama || "Mahasiswa"} (${mahasiswa()?.nim || ""})`}
        description={`Kuesioner: ${questionnaire()?.name || "Kuesioner"} - Rincian butir pertanyaan dan respons yang dipilih.`}
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              class="btn-secondary"
              onClick={() =>
                navigate(`/surveys/questionnaire/${questionnaireId}/mahasiswas`)
              }
            >
              <IconArrowLeft />
              Kembali ke Daftar Mahasiswa
            </button>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={() =>
                  printTableToPdf({
                    title: `Jawaban Survei: ${mahasiswa()?.nama || ""} (${mahasiswa()?.nim || ""})`,
                    subtitle: `Kuesioner: ${questionnaire()?.name || ""}`,
                    headers: ["No", "Pertanyaan", "Jawaban Terpilih", "Skor"],
                    rows: answers().map((a, i) => [
                      String(i + 1),
                      a.question,
                      getOptionLabel(a, a.score),
                      `${a.score} Poin`,
                    ]),
                  })
                }
              >
                <IconPrinter />
                Cetak Jawaban
              </button>
            </Show>
          </div>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showEditModal()} onClose={closeEditModal}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>Koreksi Pilihan Jawaban</h2>
            <button onClick={closeEditModal} class="btn-secondary" type="button">
              Batal
            </button>
          </div>
          <form onSubmit={handleEditSubmit} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label>Pertanyaan:</label>
              <p
                style={{
                  padding: "10px 14px",
                  "background-color": "var(--gray-50)",
                  "border-radius": "var(--radius-sm)",
                  border: "1px solid var(--gray-200)",
                  "font-size": "14px",
                  "line-height": "1.5",
                  margin: "0",
                }}
              >
                {editingAnswer()?.question}
              </p>
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="editScore">
                Ubah Pilihan Jawaban / Skor <span class="required">*</span>
              </label>
              <select
                id="editScore"
                class="form-select"
                value={selectedScore()}
                onChange={(e) => setSelectedScore(Number(e.currentTarget.value))}
                required
                disabled={isLoading()}
              >
                <Show when={editingAnswer()}>
                  {(ans) => (
                    <>
                      <option value={1}>{getOptionLabel(ans(), 1)}</option>
                      <option value={2}>{getOptionLabel(ans(), 2)}</option>
                      <option value={3}>{getOptionLabel(ans(), 3)}</option>
                      <option value={4}>{getOptionLabel(ans(), 4)}</option>
                      <option value={5}>{getOptionLabel(ans(), 5)}</option>
                    </>
                  )}
                </Show>
              </select>
            </div>

            <button
              type="submit"
              class="btn-submit"
              disabled={isLoading()}
            >
              {isLoading() ? "Menyimpan..." : "Perbarui Jawaban"}
            </button>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Hapus Jawaban Butir Soal"
        message="Apakah Anda yakin ingin menghapus jawaban mahasiswa pada butir soal ini?"
        confirmLabel={isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <DataTable
        rows={answers()}
        columns={columns}
        isLoading={isLoading()}
        emptyMessage="Belum ada jawaban dari mahasiswa ini."
        itemsPerPage={10}
      />
    </div>
  );
};

export default MahasiswaSubmissionsPage;
