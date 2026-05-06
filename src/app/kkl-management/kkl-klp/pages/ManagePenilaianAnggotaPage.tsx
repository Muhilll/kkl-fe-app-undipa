import { Component, createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PenilaianForm from "../../penilaian/pages/Form";
import PenilaianTable from "../../penilaian/pages/Table";
import { penilaianApi } from "../../penilaian/service/penilaian.api";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklKlpAPI } from "../service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import { pembimbingLapanganAPI } from "../../pembimbing-lapangan/service/pembimbing-lapangan.api";
import type { Penilaian, CreatePenilaianInput, UpdatePenilaianInput } from "../../penilaian/type/penilaian";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ManagePenilaianAnggotaPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const agtId = Number(params.agtId);
  const klpId = Number(params.id);

  const [penilaians, setPenilaians] = createSignal<Penilaian[]>([]);
  const [agt, setAgt] = createSignal<KklAgt | null>(null);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [penilais, setPenilais] = createSignal<any[]>([]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPenilaian, setEditingPenilaian] = createSignal<Penilaian | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingPenilaianId, setDeletingPenilaianId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [penilaianRes, agtRes, instansiRes, klpRes, penilaiRes, periodeRes] = await Promise.all([
        penilaianApi.getAll(),
        kklAgtAPI.getById(String(agtId)),
        instansiAPI.getAll(),
        kklKlpAPI.getAll(),
        pembimbingLapanganAPI.getAll(),
        kklPeriodeAPI.getAll()
      ]);
      if (penilaianRes.success && penilaianRes.data) {
        setPenilaians(penilaianRes.data.filter(p => p.kkl_agt_id === agtId));
      }
      if (agtRes.success && agtRes.data) setAgt(agtRes.data);
      if (instansiRes.success && instansiRes.data) setInstansis(instansiRes.data);
      if (klpRes.success && klpRes.data) setKlps(klpRes.data);
      if (penilaiRes.success && penilaiRes.data) setPenilais(penilaiRes.data);
      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
    } catch (e) {
      setError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  const submitPenilaian = async (data: CreatePenilaianInput | UpdatePenilaianInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingPenilaian();
      const result = editing
        ? await penilaianApi.update(editing.id, data as UpdatePenilaianInput)
        : await penilaianApi.create(data as CreatePenilaianInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Penilaian updated!" : "Penilaian created!" });
        setShowForm(false);
        setEditingPenilaian(null);
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

  const handleEdit = (penilaian: Penilaian) => {
    setEditingPenilaian(penilaian);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPenilaian(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPenilaian(null);
  };

  const requestDelete = (id: string) => setDeletingPenilaianId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingPenilaianId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await penilaianApi.delete(Number(id));
      if (result.success) {
        setToast({ type: "success", message: "Penilaian deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingPenilaianId(null);
    }
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate(`/kkl-management/kkl-klps/${klpId}/anggota`)}
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
        title={agt() ? `Penilaian: ${agt()?.mahasiswa?.nama}` : "Manajemen Penilaian Anggota"}
        description={agt() ? `Kelola penilaian untuk ${agt()?.mahasiswa?.nama} (${agt()?.mahasiswa?.nim}).` : "Loading..."}
        action={
          <button class="btn-create" onClick={openCreateForm}>
            <IconPlusCircle />
            Add New Penilaian
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingPenilaian() ? "Edit Penilaian" : "Add New Penilaian"}</h2>
            <button onClick={closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <PenilaianForm
            initialData={editingPenilaian() || undefined}
            agts={agt() ? [agt()!] : []}
            penilais={penilais()}
            instansis={instansis()}
            klps={klps()}
            periodes={periodes()}
            defaultKklAgtId={agtId}
            onSubmit={submitPenilaian as any}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingPenilaianId()}
        title="Delete Penilaian"
        message="Are you sure you want to delete this penilaian? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPenilaianId(null)}
      />

      <PenilaianTable
        penilaians={penilaians()}
        agts={agt() ? [agt()!] : []}
        penilais={penilais()}
        isLoading={isLoading()}
        canUpdate={true}
        canDelete={true}
        onEdit={handleEdit}
        onDelete={requestDelete}
      />
    </div>
  );
};

export default ManagePenilaianAnggotaPage;
