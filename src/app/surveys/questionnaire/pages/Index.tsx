import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useQuestionnaireManagement } from "../hook/useQuestionnaireManagement";
import QuestionnaireForm from "./Form";
import QuestionnaireTable from "./Table";

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

const QuestionnairePage: Component = () => {
  const management = useQuestionnaireManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={management.toast()} onClose={management.clearToast} />

      <PageHeader
        title="Daftar Kuesioner (Questionnaire)"
        description="Kelola kuesioner survei, daftar pertanyaan, dan pantau respons dari mahasiswa."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={() =>
                  printTableToPdf({
                    title: "Data Kuesioner Survei",
                    subtitle: "Daftar kuesioner survei dan evaluasi KKL.",
                    headers: [
                      "No",
                      "Nama Kuesioner",
                      "Deskripsi",
                      "Jumlah Soal",
                      "Responden",
                    ],
                    rows: management.questionnaires().map((p, i) => [
                      String(i + 1),
                      p.name,
                      p.desc,
                      `${p.total_questions || 0} Soal`,
                      `${p.total_respondents || 0} Mahasiswa`,
                    ]),
                  })
                }
              >
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={management.openCreateForm}>
                <IconPlusCircle />
                Tambah Kuesioner
              </button>
            </Show>
          </div>
        }
      />

      <Show when={management.error()}>
        <div class="error-message">{management.error()}</div>
      </Show>

      <Modal open={management.showForm()} onClose={management.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {management.editingQuestionnaire()
                ? "Edit Kuesioner"
                : "Tambah Kuesioner Baru"}
            </h2>
            <button
              onClick={management.closeForm}
              class="btn-secondary"
              type="button"
            >
              Batal
            </button>
          </div>
          <QuestionnaireForm
            initialData={management.editingQuestionnaire() || undefined}
            onSubmit={management.handleSubmit}
            isLoading={management.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!management.deletingId()}
        title="Hapus Kuesioner"
        message="Apakah Anda yakin ingin menghapus kuesioner ini? Semua pertanyaan dan jawaban mahasiswa yang terkait juga akan terhapus."
        confirmLabel={management.isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={management.isLoading()}
        onConfirm={management.handleDeleteConfirm}
        onCancel={() => management.setDeletingId(null)}
      />

      <QuestionnaireTable
        questionnaires={management.questionnaires()}
        isLoading={management.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={management.handleEdit}
        onDelete={management.requestDelete}
        onManageQuestions={management.handleManageQuestions}
        onManageSubmissions={management.handleManageSubmissions}
      />
    </div>
  );
};

export default QuestionnairePage;
