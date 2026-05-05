import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useJurusanManagement } from "../hook/useJurusanManagement";
import JurusanForm from "./Form";
import JurusanTable from "./Table";

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

const JurusanPage: Component = () => {
  const jurusanManagement = useJurusanManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={jurusanManagement.toast()} onClose={jurusanManagement.clearToast} />

      <PageHeader
        title="Jurusan Management"
        description="Manage jurusan codes and names used across the system."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Jurusan",
                subtitle: "Daftar jurusan yang terdaftar dalam sistem.",
                headers: ["No", "Kode", "Nama"],
                rows: jurusanManagement.jurusans().map((j, i) => [String(i + 1), j.kode, j.nama]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={jurusanManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Jurusan
              </button>
            </Show>
          </div>
        }
      />

      <Show when={jurusanManagement.error()}>
        <div class="error-message">{jurusanManagement.error()}</div>
      </Show>

      <Modal open={jurusanManagement.showForm()} onClose={jurusanManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{jurusanManagement.editingJurusan() ? "Edit Jurusan" : "Add New Jurusan"}</h2>
            <button
              onClick={jurusanManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <JurusanForm
            initialData={jurusanManagement.editingJurusan() || undefined}
            onSubmit={jurusanManagement.handleSubmit}
            isLoading={jurusanManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!jurusanManagement.deletingJurusanId()}
        title="Delete Jurusan"
        message="Are you sure you want to delete this jurusan? This action cannot be undone."
        confirmLabel={jurusanManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={jurusanManagement.isLoading()}
        onConfirm={jurusanManagement.handleDeleteConfirm}
        onCancel={() => jurusanManagement.setDeletingJurusanId(null)}
      />

      <JurusanTable
        jurusans={jurusanManagement.jurusans()}
        isLoading={jurusanManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={jurusanManagement.handleEdit}
        onDelete={jurusanManagement.requestDelete}
      />
    </div>
  );
};

export default JurusanPage;
