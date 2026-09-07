import { Component, For, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useSubmissionsManagement } from "../hook/useSubmissionsManagement";
import SubmissionForm from "./Form";
import SubmissionsTable from "./Table";

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

const SubmissionsGeneralPage: Component = () => {
  const management = useSubmissionsManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={management.toast()} onClose={management.clearToast} />

      <PageHeader
        title="Daftar Jawaban Survei (Submissions)"
        description="Kelola seluruh jawaban dan respons survei yang dikirimkan oleh mahasiswa."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={() =>
                  printTableToPdf({
                    title: "Daftar Respons Kuesioner Mahasiswa",
                    subtitle: "Rekap seluruh jawaban survei mahasiswa.",
                    headers: [
                      "No",
                      "NIM",
                      "Nama Mahasiswa",
                      "Kuesioner",
                      "Pertanyaan",
                      "Skor",
                    ],
                    rows: management.submissions().map((s, i) => [
                      String(i + 1),
                      s.mahasiswa_nim || "-",
                      s.mahasiswa_nama || "-",
                      s.questionnaire_name || "-",
                      s.question ? `${s.question.substring(0, 50)}...` : "-",
                      String(s.score),
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
                Tambah Jawaban
              </button>
            </Show>
          </div>
        }
      />

      <div class="active-periode-panel" style={{ "flex-wrap": "wrap" }}>
        <div class="active-periode-summary">
          <span class="active-periode-label">Filter Data Jawaban</span>
          <strong>
            {management.selectedQuestionnaireFilter() ||
            management.selectedMahasiswaFilter()
              ? "Filter Aktif Diterapkan"
              : "Menampilkan Seluruh Jawaban Kuesioner"}
          </strong>
        </div>

        <div
          style={{
            display: "flex",
            "align-items": "center",
            "flex-wrap": "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <label
              for="filterQn"
              style={{
                "font-size": "11px",
                "font-weight": "700",
                color: "var(--gray-500)",
                "letter-spacing": "0.07em",
                "text-transform": "uppercase",
              }}
            >
              Kuesioner:
            </label>
            <select
              id="filterQn"
              class="form-select"
              style={{ width: "auto", "min-width": "220px" }}
              value={management.selectedQuestionnaireFilter()}
              onChange={(e) =>
                management.handleFilterChange(
                  e.currentTarget.value,
                  management.selectedMahasiswaFilter(),
                )
              }
            >
              <option value="">Semua Kuesioner</option>
              <For each={management.questionnaires()}>
                {(q) => <option value={q.id}>{q.name}</option>}
              </For>
            </select>
          </div>

          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <label
              for="filterMhs"
              style={{
                "font-size": "11px",
                "font-weight": "700",
                color: "var(--gray-500)",
                "letter-spacing": "0.07em",
                "text-transform": "uppercase",
              }}
            >
              Mahasiswa:
            </label>
            <select
              id="filterMhs"
              class="form-select"
              style={{ width: "auto", "min-width": "220px" }}
              value={management.selectedMahasiswaFilter()}
              onChange={(e) =>
                management.handleFilterChange(
                  management.selectedQuestionnaireFilter(),
                  e.currentTarget.value,
                )
              }
            >
              <option value="">Semua Mahasiswa</option>
              <For each={management.mahasiswas()}>
                {(m) => (
                  <option value={m.id}>
                    {m.nama} ({m.nim})
                  </option>
                )}
              </For>
            </select>
          </div>

          <Show
            when={
              management.selectedQuestionnaireFilter() ||
              management.selectedMahasiswaFilter()
            }
          >
            <button
              class="btn-secondary"
              style={{ padding: "8px 12px", "font-size": "12px" }}
              onClick={() => management.handleFilterChange("", "")}
              type="button"
            >
              Reset Filter
            </button>
          </Show>
        </div>
      </div>

      <Show when={management.error()}>
        <div class="error-message">{management.error()}</div>
      </Show>

      <Modal open={management.showForm()} onClose={management.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {management.editingSubmission()
                ? "Edit Jawaban"
                : "Input Jawaban Baru"}
            </h2>
            <button
              onClick={management.closeForm}
              class="btn-secondary"
              type="button"
            >
              Batal
            </button>
          </div>
          <SubmissionForm
            initialData={management.editingSubmission() || undefined}
            questionnaires={management.questionnaires()}
            questions={management.questions()}
            mahasiswas={management.mahasiswas()}
            onSubmit={management.handleSubmit}
            isLoading={management.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!management.deletingId()}
        title="Hapus Jawaban"
        message="Apakah Anda yakin ingin menghapus data jawaban ini?"
        confirmLabel={management.isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={management.isLoading()}
        onConfirm={management.handleDeleteConfirm}
        onCancel={() => management.setDeletingId(null)}
      />

      <SubmissionsTable
        submissions={management.submissions()}
        isLoading={management.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={management.handleEdit}
        onDelete={management.requestDelete}
      />
    </div>
  );
};

export default SubmissionsGeneralPage;
