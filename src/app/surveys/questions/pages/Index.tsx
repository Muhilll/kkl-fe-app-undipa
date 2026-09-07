import { Component, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useQuestionsManagement } from "../hook/useQuestionsManagement";
import QuestionForm from "./Form";
import QuestionsTable from "./Table";
import type { Question } from "../type/questions";

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

const QuestionsGeneralPage: Component = () => {
  const management = useQuestionsManagement();
  const permissions = usePagePermissions();
  const navigate = useNavigate();

  const handleViewSubmissions = (q: Question) => {
    navigate(
      `/surveys/questionnaire/${q.questionnaire_id}/questions/${q.id}/submissions`,
    );
  };

  return (
    <div class="user-page">
      <Toast toast={management.toast()} onClose={management.clearToast} />

      <PageHeader
        title="Bank Soal Pertanyaan (Questions)"
        description="Kelola seluruh butir pertanyaan survei secara global atau filter per kuesioner."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={() =>
                  printTableToPdf({
                    title: "Daftar Butir Pertanyaan Survei",
                    subtitle: "Seluruh bank pertanyaan survei dan kuesioner.",
                    headers: [
                      "No",
                      "Kuesioner",
                      "Pertanyaan",
                      "Bobot Skor",
                      "Respons",
                    ],
                    rows: management.questions().map((q, i) => [
                      String(i + 1),
                      q.questionnaire_name || "-",
                      q.question,
                      `${q.score} Poin`,
                      `${q.total_submissions || 0} Jawaban`,
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
                Tambah Pertanyaan
              </button>
            </Show>
          </div>
        }
      />

      <div class="active-periode-panel">
        <div class="active-periode-summary">
          <span class="active-periode-label">Filter Kuesioner</span>
          <strong>
            {management.selectedQuestionnaireFilter()
              ? management
                  .questionnaires()
                  .find(
                    (q) =>
                      String(q.id) === management.selectedQuestionnaireFilter(),
                  )?.name || "Kuesioner Terpilih"
              : "Semua Kuesioner (Menampilkan Seluruh Pertanyaan)"}
          </strong>
        </div>
        <div class="active-periode-control">
          <select
            id="filterQ"
            class="form-select"
            value={management.selectedQuestionnaireFilter()}
            onChange={(e) =>
              management.handleFilterChange(e.currentTarget.value)
            }
          >
            <option value="">Semua Kuesioner</option>
            <For each={management.questionnaires()}>
              {(q) => <option value={q.id}>{q.name}</option>}
            </For>
          </select>
        </div>
      </div>

      <Show when={management.error()}>
        <div class="error-message">{management.error()}</div>
      </Show>

      <Modal open={management.showForm()} onClose={management.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {management.editingQuestion()
                ? "Edit Pertanyaan"
                : "Tambah Pertanyaan Baru"}
            </h2>
            <button
              onClick={management.closeForm}
              class="btn-secondary"
              type="button"
            >
              Batal
            </button>
          </div>
          <QuestionForm
            initialData={management.editingQuestion() || undefined}
            questionnaires={management.questionnaires()}
            defaultQuestionnaireId={
              management.selectedQuestionnaireFilter()
                ? Number(management.selectedQuestionnaireFilter())
                : undefined
            }
            onSubmit={management.handleSubmit}
            isLoading={management.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!management.deletingId()}
        title="Hapus Pertanyaan"
        message="Apakah Anda yakin ingin menghapus butir pertanyaan ini? Semua data jawaban terkait akan ikut terhapus."
        confirmLabel={management.isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={management.isLoading()}
        onConfirm={management.handleDeleteConfirm}
        onCancel={() => management.setDeletingId(null)}
      />

      <QuestionsTable
        questions={management.questions()}
        isLoading={management.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={management.handleEdit}
        onDelete={management.requestDelete}
        onViewSubmissions={handleViewSubmissions}
      />
    </div>
  );
};

export default QuestionsGeneralPage;
