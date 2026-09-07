import {
  Component,
  createEffect,
  createSignal,
  Show,
} from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import DataTable, { type DataTableColumn } from "../../../../components/ui/DataTable";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { questionnaireAPI } from "../service/questionnaire.api";
import type {
  Questionnaire,
  QuestionnaireRespondent,
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

const QuestionnaireMahasiswasPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const questionnaireId = Number(params.id);
  const permissions = usePagePermissions();

  const [questionnaire, setQuestionnaire] =
    createSignal<Questionnaire | null>(null);
  const [respondents, setRespondents] = createSignal<
    QuestionnaireRespondent[]
  >([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [deletingMahasiswaId, setDeletingMahasiswaId] = createSignal<
    string | null
  >(null);
  const [toast, setToast] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [qRes, rRes] = await Promise.all([
        questionnaireAPI.getById(questionnaireId),
        questionnaireAPI.getMahasiswas(questionnaireId),
      ]);

      if (qRes.success && qRes.data) {
        setQuestionnaire(qRes.data);
      } else {
        setError("Kuesioner tidak ditemukan.");
      }

      if (rRes.success && rRes.data) {
        setRespondents(rRes.data);
      }
    } catch {
      setError("Gagal memuat data mahasiswa responden.");
    } finally {
      setIsLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const handleDeleteConfirm = async () => {
    const mahasiswaId = deletingMahasiswaId();
    if (!mahasiswaId) return;

    setIsLoading(true);
    try {
      const res = await questionnaireAPI.deleteMahasiswaSubmissions(
        questionnaireId,
        mahasiswaId,
      );
      if (res.success) {
        setToast({
          message: "Data pengisian mahasiswa berhasil direset!",
          type: "success",
        });
        setDeletingMahasiswaId(null);
        await fetchData();
      } else {
        setToast({
          message: res.error || "Gagal mereset jawaban mahasiswa.",
          type: "error",
        });
      }
    } catch {
      setToast({
        message: "Terjadi kesalahan saat mereset jawaban.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns: DataTableColumn<QuestionnaireRespondent>[] = [
    {
      header: "No",
      cell: (_: any, index: number) => <>{index + 1}</>,
      sortValue: (r: QuestionnaireRespondent) => r.mahasiswa_id,
    },
    {
      header: "Mahasiswa",
      cell: (r: QuestionnaireRespondent) => (
        <div style={{ display: "flex", "flex-direction": "column", gap: "2px" }}>
          <span style={{ "font-weight": "500" }}>{r.nama}</span>
          <span style={{ "font-size": "12px", color: "var(--gray-500)" }}>
            NIM: {r.nim}
          </span>
        </div>
      ),
      sortValue: (r: QuestionnaireRespondent) => r.nama,
    },
    {
      header: "Jurusan",
      cell: (r: QuestionnaireRespondent) => <>{r.jurusan_nama || "-"}</>,
      sortValue: (r: QuestionnaireRespondent) => r.jurusan_nama || "",
    },
    {
      header: "Pertanyaan Dijawab",
      cell: (r: QuestionnaireRespondent) => (
        <span
          style={{
            padding: "3px 8px",
            "background-color": "var(--blue-50, #eff6ff)",
            color: "var(--blue-700, #1d4ed8)",
            "border-radius": "10px",
            "font-size": "12px",
            "font-weight": "500",
          }}
        >
          {r.total_answered} Jawaban
        </span>
      ),
      sortValue: (r: QuestionnaireRespondent) => r.total_answered,
    },
    {
      header: "Total Skor",
      cell: (r: QuestionnaireRespondent) => (
        <span style={{ "font-weight": "600" }}>{r.total_score} Poin</span>
      ),
      sortValue: (r: QuestionnaireRespondent) => r.total_score,
    },
    {
      header: "Rata-rata",
      cell: (r: QuestionnaireRespondent) => (
        <span
          style={{
            padding: "3px 8px",
            "background-color": "var(--purple-50, #faf5ff)",
            color: "var(--purple-700, #7e22ce)",
            "border-radius": "10px",
            "font-size": "12px",
            "font-weight": "600",
          }}
        >
          {r.average_score} / 5
        </span>
      ),
      sortValue: (r: QuestionnaireRespondent) => r.average_score,
    },
    {
      header: "Tanggal Submit",
      cell: (r: QuestionnaireRespondent) => (
        <span style={{ "font-size": "12px", color: "var(--gray-600)" }}>
          {r.last_submitted_at
            ? new Date(r.last_submitted_at).toLocaleString("id-ID")
            : "-"}
        </span>
      ),
      sortValue: (r: QuestionnaireRespondent) => r.last_submitted_at || "",
    },
    {
      header: "Actions",
      sortable: false,
      headerStyle: { "text-align": "right" as const },
      cellClass: "td-actions",
      cell: (r: QuestionnaireRespondent) => (
        <div class="action-btns">
          <button
            class="btn-icon"
            style={{ color: "var(--blue-600, #2563eb)" }}
            title="Lihat Rincian Jawaban Mahasiswa Ini"
            onClick={() =>
              navigate(
                `/surveys/questionnaire/${questionnaireId}/mahasiswas/${r.mahasiswa_id}/submissions`,
              )
            }
          >
            <IconEye />
          </button>
          {permissions.canDelete() && (
            <button
              class="btn-icon btn-delete"
              title="Reset / Hapus Pengisian Mahasiswa"
              onClick={() => setDeletingMahasiswaId(String(r.mahasiswa_id))}
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
        title={`Daftar Mahasiswa Responden: ${questionnaire()?.name || "Kuesioner"}`}
        description="Daftar mahasiswa yang telah menyelesaikan pengisian kuesioner ini."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              class="btn-secondary"
              onClick={() => navigate("/surveys/questionnaire")}
            >
              <IconArrowLeft />
              Kembali ke Kuesioner
            </button>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={() =>
                  printTableToPdf({
                    title: `Responden Kuesioner: ${questionnaire()?.name || ""}`,
                    subtitle:
                      "Rekap mahasiswa yang telah mengisi survei kuesioner.",
                    headers: [
                      "No",
                      "NIM",
                      "Nama Mahasiswa",
                      "Jurusan",
                      "Jawaban",
                      "Total Skor",
                      "Rata-rata",
                    ],
                    rows: respondents().map((r, i) => [
                      String(i + 1),
                      r.nim,
                      r.nama,
                      r.jurusan_nama || "-",
                      `${r.total_answered} Soal`,
                      String(r.total_score),
                      String(r.average_score),
                    ]),
                  })
                }
              >
                <IconPrinter />
                Cetak Rekap
              </button>
            </Show>
          </div>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <ConfirmModal
        open={!!deletingMahasiswaId()}
        title="Reset Pengisian Mahasiswa"
        message="Apakah Anda yakin ingin menghapus seluruh jawaban mahasiswa ini pada kuesioner ini? Tindakan ini akan mengizinkan mahasiswa untuk mengisi ulang."
        confirmLabel={isLoading() ? "Mereset..." : "Reset Jawaban"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingMahasiswaId(null)}
      />

      <DataTable
        rows={respondents()}
        columns={columns}
        isLoading={isLoading()}
        emptyMessage="Belum ada mahasiswa yang mengirim jawaban untuk kuesioner ini."
        itemsPerPage={10}
      />
    </div>
  );
};

export default QuestionnaireMahasiswasPage;
