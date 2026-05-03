import { Component, Show } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { usePenilaianManagement } from "../hook/usePenilaianManagement";
import PenilaianForm from "./Form";
import PenilaianTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PenilaianPage: Component = () => {
  const penilaianManagement = usePenilaianManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={penilaianManagement.toast()} onClose={penilaianManagement.clearToast} />

      <PageHeader
        title="Penilaian KKL Management"
        description="Manage penilaian kegiatan KKL mahasiswa."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={penilaianManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Penilaian
          </button>
        ) : undefined}
      />

      <Show when={penilaianManagement.error()}>
        <div class="error-message">{penilaianManagement.error()}</div>
      </Show>

      <Modal open={penilaianManagement.showForm()} onClose={penilaianManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{penilaianManagement.editingPenilaian() ? "Edit Penilaian" : "Add New Penilaian"}</h2>
            <button onClick={penilaianManagement.closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <PenilaianForm
            initialData={penilaianManagement.editingPenilaian() || undefined}
            agts={penilaianManagement.agts()}
            penilais={penilaianManagement.penilais()}
            instansis={penilaianManagement.instansis()}
            klps={penilaianManagement.klps()}
            periodes={penilaianManagement.periodes()}
            onSubmit={penilaianManagement.handleSubmit}
            isLoading={penilaianManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!penilaianManagement.deletingPenilaianId()}
        title="Delete Penilaian"
        message="Are you sure you want to delete this penilaian? This action cannot be undone."
        confirmLabel={penilaianManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={penilaianManagement.isLoading()}
        onConfirm={penilaianManagement.handleDeleteConfirm}
        onCancel={() => penilaianManagement.setDeletingPenilaianId(null)}
      />

      <PenilaianTable
        penilaians={penilaianManagement.penilaians()}
        agts={penilaianManagement.agts()}
        penilais={penilaianManagement.penilais()}
        isLoading={penilaianManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={penilaianManagement.handleEdit}
        onDelete={penilaianManagement.requestDelete}
      />
    </div>
  );
};

export default PenilaianPage;
