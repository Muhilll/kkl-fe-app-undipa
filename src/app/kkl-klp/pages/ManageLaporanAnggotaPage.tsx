import { Component, createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import LaporanForm from "../../laporan/pages/Form";
import LaporanTable from "../../laporan/pages/Table";
import { laporanAPI } from "../../laporan/service/laporan.api";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { instansiAPI } from "../../master-data/instansi/service/instansi.api";
import { kklKlpAPI } from "../service/kkl-klp.api";
import { kklPeriodeAPI } from "../../master-data/kkl-periode/service/kkl-periode.api";
import type { Laporan, CreateLaporanInput, UpdateLaporanInput } from "../../laporan/type/laporan";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ManageLaporanAnggotaPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const agtId = Number(params.agtId);
  const klpId = Number(params.id);

  const [laporans, setLaporans] = createSignal<Laporan[]>([]);
  const [agt, setAgt] = createSignal<KklAgt | null>(null);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingLaporan, setEditingLaporan] = createSignal<Laporan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingLaporanId, setDeletingLaporanId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [laporanRes, agtRes, instansiRes, klpRes, periodeRes] = await Promise.all([
        laporanAPI.getAll(),
        kklAgtAPI.getById(String(agtId)),
        instansiAPI.getAll(),
        kklKlpAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);
      if (laporanRes.success && laporanRes.data) {
        setLaporans(laporanRes.data.filter(l => l.kkl_agt_id === agtId));
      }
      if (agtRes.success && agtRes.data) {
        setAgt(agtRes.data);
      }
      if (instansiRes.success && instansiRes.data) {
        setInstansis(instansiRes.data);
      }
      if (klpRes.success && klpRes.data) {
        setKlps(klpRes.data);
      }
      if (periodeRes.success && periodeRes.data) {
        setPeriodes(periodeRes.data);
      }
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  const submitLaporan = async (data: CreateLaporanInput | UpdateLaporanInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingLaporan();
      const result = editing
        ? await laporanAPI.update(String(editing.id), data as UpdateLaporanInput)
        : await laporanAPI.create(data as CreateLaporanInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Laporan updated!" : "Laporan created!" });
        setShowForm(false);
        setEditingLaporan(null);
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Operation failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (laporan: Laporan) => {
    setEditingLaporan(laporan);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingLaporan(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLaporan(null);
  };

  const requestDelete = (id: string) => setDeletingLaporanId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingLaporanId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await laporanAPI.delete(id);
      if (result.success) {
        setToast({ type: "success", message: "Laporan deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingLaporanId(null);
    }
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate(`/kkl-klps/${klpId}/anggota`)}
          class="btn-secondary"
          style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Manajemen Anggota
        </button>
      </div>

      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title={agt() ? `Laporan: ${agt()?.mahasiswa?.nama}` : "Manajemen Laporan Anggota"}
        description={agt() ? `Kelola laporan kegiatan KKL untuk ${agt()?.mahasiswa?.nama} (${agt()?.mahasiswa?.nim}).` : "Loading..."}
        action={
          <button class="btn-create" onClick={openCreateForm}>
            <IconPlusCircle />
            Add New Laporan
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingLaporan() ? "Edit Laporan" : "Add New Laporan"}</h2>
            <button onClick={closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <LaporanForm
            initialData={editingLaporan() || undefined}
            agts={agt() ? [agt()!] : []}
            instansis={instansis()}
            klps={klps()}
            periodes={periodes()}
            defaultKklAgtId={agtId}
            onSubmit={submitLaporan}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingLaporanId()}
        title="Delete Laporan"
        message="Are you sure you want to delete this laporan? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLaporanId(null)}
      />

      <LaporanTable
        laporans={laporans()}
        isLoading={isLoading()}
        canUpdate={true}
        canDelete={true}
        onEdit={handleEdit}
        onDelete={requestDelete}
      />
    </div>
  );
};

export default ManageLaporanAnggotaPage;
