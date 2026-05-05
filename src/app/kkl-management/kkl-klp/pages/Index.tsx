import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
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

const KklKlpPage: Component = () => {
  const klpManagement = useKklKlpManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={klpManagement.toast()} onClose={klpManagement.clearToast} />

      <PageHeader
        title="Kelompok KKL Management"
        description="Manage kelompok pembagian mahasiswa berdasarkan periode, instansi, dan dosen."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Kelompok KKL",
                subtitle: "Daftar kelompok pembagian mahasiswa KKL.",
                headers: ["No", "Nama Kelompok", "Periode", "Instansi", "Dosen Pembimbing"],
                rows: klpManagement.klps().map((p, i) => [String(i + 1), p.nama, `${p.kkl_periode?.nama || "-"} (${p.kkl_periode?.tahun || "-"})`, p.instansi?.nama || "-", `${p.dosen?.nama || "-"} - ${p.dosen?.nidn || "-"}`]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={klpManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Kelompok
              </button>
            </Show>
          </div>
        }
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
