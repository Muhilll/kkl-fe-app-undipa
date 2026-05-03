import { Component, Show } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useKklKlpManagement } from "../hook/useKklKlpManagement";
import KklKlpForm from "./Form";
import KklKlpTable from "./Table";

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

const KklKlpPage: Component = () => {
  const klpManagement = useKklKlpManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={klpManagement.toast()} onClose={klpManagement.clearToast} />

      <PageHeader
        title="Kelompok KKL Management"
        description="Manage kelompok pembagian mahasiswa berdasarkan periode, instansi, dan dosen."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={klpManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Kelompok
          </button>
        ) : undefined}
      />

      <Show when={klpManagement.error()}>
        <div class="error-message">{klpManagement.error()}</div>
      </Show>

      <Modal open={klpManagement.showForm()} onClose={klpManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{klpManagement.editingKlp() ? "Edit Kelompok" : "Add New Kelompok"}</h2>
            <button
              onClick={klpManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <KklKlpForm
            initialData={klpManagement.editingKlp() || undefined}
            klps={klpManagement.klps()}
            periodes={klpManagement.periodes()}
            instansis={klpManagement.instansis()}
            dosens={klpManagement.dosens()}
            onSubmit={klpManagement.handleSubmit}
            isLoading={klpManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!klpManagement.deletingKlpId()}
        title="Delete Kelompok"
        message="Are you sure you want to delete this kelompok? This action cannot be undone."
        confirmLabel={klpManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={klpManagement.isLoading()}
        onConfirm={klpManagement.handleDeleteConfirm}
        onCancel={() => klpManagement.setDeletingKlpId(null)}
      />

      <KklKlpTable
        klps={klpManagement.klps()}
        isLoading={klpManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={klpManagement.handleEdit}
        onDelete={klpManagement.requestDelete}
        onManageAnggota={klpManagement.handleManageAnggota}
      />
    </div>
  );
};

export default KklKlpPage;
