import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { useKklAgtManagement } from "../hook/useKklAgtManagement";
import KklAgtForm from "./Form";
import KklAgtTable from "./Table";

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

const KklAgtPage: Component = () => {
  const agtManagement = useKklAgtManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={agtManagement.toast()} onClose={agtManagement.clearToast} />

      <PageHeader
        title="Anggota KKL Management"
        description="Manage pendaftaran mahasiswa ke dalam kelompok KKL."
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button class="btn-secondary" onClick={() => printTableToPdf({
                title: "Data Anggota KKL",
                subtitle: "Daftar mahasiswa anggota kelompok KKL.",
                headers: ["No", "Nama Mahasiswa", "NIM", "Periode KKL", "Instansi Tujuan", "Dosen Pembimbing"],
                rows: agtManagement.agts().map((p, i) => [String(i + 1), p.mahasiswa?.nama || "-", p.mahasiswa?.nim || "-", `${p.kkl_klp?.kkl_periode?.semester || "-"} - ${p.kkl_klp?.kkl_periode?.tahun || "-"}`, p.kkl_klp?.instansi?.nama || "-", p.kkl_klp?.dosen?.nama || "-"]),
              })}>
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate()}>
              <button class="btn-create" onClick={agtManagement.openCreateForm}>
                <IconPlusCircle />
                Add New Anggota
              </button>
            </Show>
          </div>
        }
      />

      <Show when={agtManagement.error()}>
        <div class="error-message">{agtManagement.error()}</div>
      </Show>

      <Modal open={agtManagement.showForm()} onClose={agtManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{agtManagement.editingAgt() ? "Edit Anggota KKL" : "Add New Anggota KKL"}</h2>
            <button
              onClick={agtManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <KklAgtForm
            initialData={agtManagement.editingAgt() || undefined}
            agts={agtManagement.agts()}
            klps={agtManagement.klps()}
            mahasiswas={agtManagement.mahasiswas()}
            instansis={agtManagement.instansis()}
            periodes={agtManagement.periodes()}
            onSubmit={agtManagement.handleSubmit}
            isLoading={agtManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!agtManagement.deletingAgtId()}
        title="Delete Anggota"
        message="Are you sure you want to remove this mahasiswa from the kelompok? This action cannot be undone."
        confirmLabel={agtManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={agtManagement.isLoading()}
        onConfirm={agtManagement.handleDeleteConfirm}
        onCancel={() => agtManagement.setDeletingAgtId(null)}
      />

      <KklAgtTable
        agts={agtManagement.agts()}
        isLoading={agtManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={agtManagement.handleEdit}
        onDelete={agtManagement.requestDelete}
      />
    </div>
  );
};

export default KklAgtPage;
