import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useDosenManagement } from "../hook/useDosenManagement";
import DosenForm from "./Form";
import DosenTable from "./Table";

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

const DosenPage: Component = () => {
  const dosenManagement = useDosenManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={dosenManagement.toast()} onClose={dosenManagement.clearToast} />

      <PageHeader
        title="Dosen Management"
        description="Manage dosen data."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Dosen",
                subtitle: "Daftar dosen pembimbing KKL.",
                headers: ["No", "NIDN", "Nama", "Email", "No. Telp"],
                rows: dosenManagement.dosens().map((d, i) => [String(i + 1), d.nidn, d.nama, d.email, d.telp || "-"]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={dosenManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Dosen
              </button>
            </Show>
          </div>
        }
      />

      <Show when={dosenManagement.error()}>
        <div class="error-message">{dosenManagement.error()}</div>
      </Show>

      <Modal open={dosenManagement.showForm()} onClose={dosenManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{dosenManagement.editingDosen() ? "Edit Dosen" : "Add New Dosen"}</h2>
            <button
              onClick={dosenManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <DosenForm
            initialData={dosenManagement.editingDosen() || undefined}
            onSubmit={dosenManagement.handleSubmit}
            isLoading={dosenManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!dosenManagement.deletingDosenId()}
        title="Delete Dosen"
        message="Are you sure you want to delete this dosen? This action cannot be undone."
        confirmLabel={dosenManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={dosenManagement.isLoading()}
        onConfirm={dosenManagement.handleDeleteConfirm}
        onCancel={() => dosenManagement.setDeletingDosenId(null)}
      />

      <DosenTable
        dosens={dosenManagement.dosens()}
        isLoading={dosenManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={dosenManagement.handleEdit}
        onDelete={dosenManagement.requestDelete}
      />
    </div>
  );
};

export default DosenPage;
