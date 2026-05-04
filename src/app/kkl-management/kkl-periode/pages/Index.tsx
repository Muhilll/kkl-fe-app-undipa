import { Component, For, Show, createMemo } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useKklPeriodeManagement } from "../hook/useKklPeriodeManagement";
import KklPeriodeForm from "./Form";
import KklPeriodeTable from "./Table";

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

const KklPeriodePage: Component = () => {
  const periodeManagement = useKklPeriodeManagement();
  const permissions = usePagePermissions();
  const activePeriode = createMemo(() =>
    periodeManagement.periodes().find((periode) => periode.is_active),
  );

  return (
    <div class="user-page">
      <Toast toast={periodeManagement.toast()} onClose={periodeManagement.clearToast} />

      <PageHeader
        title="Periode KKL Management"
        description="Manage periodes, years, and group limits for KKL."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={periodeManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Periode
          </button>
        ) : undefined}
      />

      <Show when={periodeManagement.error()}>
        <div class="error-message">{periodeManagement.error()}</div>
      </Show>

      <div class="active-periode-panel">
        <div class="active-periode-summary">
          <span class="active-periode-label">Periode KKL Aktif</span>
          <strong>
            {activePeriode()
              ? `${activePeriode()!.nama} (${activePeriode()!.tahun} - ${activePeriode()!.semester})`
              : "Belum ada periode aktif"}
          </strong>
        </div>
        <div class="active-periode-control">
          <select
            class="form-select"
            value={periodeManagement.selectedActivePeriodeId() || activePeriode()?.id.toString() || ""}
            onChange={(e) => periodeManagement.setSelectedActivePeriodeId(e.target.value)}
            disabled={periodeManagement.isLoading() || !permissions.canUpdate()}
          >
            <option value="">Pilih periode</option>
            <For each={periodeManagement.periodes()}>
              {(periode) => (
                <option value={periode.id}>
                  {periode.nama} ({periode.tahun} - {periode.semester})
                </option>
              )}
            </For>
          </select>
          <button
            class="btn-create"
            type="button"
            onClick={periodeManagement.handleActivatePeriode}
            disabled={periodeManagement.isLoading() || !permissions.canUpdate()}
          >
            Set Aktif
          </button>
        </div>
      </div>

      <Modal open={periodeManagement.showForm()} onClose={periodeManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{periodeManagement.editingPeriode() ? "Edit Periode" : "Add New Periode"}</h2>
            <button
              onClick={periodeManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <KklPeriodeForm
            initialData={periodeManagement.editingPeriode() || undefined}
            onSubmit={periodeManagement.handleSubmit}
            isLoading={periodeManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!periodeManagement.deletingPeriodeId()}
        title="Delete Periode"
        message="Are you sure you want to delete this periode? This action cannot be undone."
        confirmLabel={periodeManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={periodeManagement.isLoading()}
        onConfirm={periodeManagement.handleDeleteConfirm}
        onCancel={() => periodeManagement.setDeletingPeriodeId(null)}
      />

      <KklPeriodeTable
        periodes={periodeManagement.periodes()}
        isLoading={periodeManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={periodeManagement.handleEdit}
        onDelete={periodeManagement.requestDelete}
      />
    </div>
  );
};

export default KklPeriodePage;
