import { Component, createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PembimbingLapanganForm from "../../pembimbing-lapangan/pages/Form";
import PembimbingLapanganTable from "../../pembimbing-lapangan/pages/Table";
import { pembimbingLapanganAPI } from "../../pembimbing-lapangan/service/pembimbing-lapangan.api";
import { instansiAPI } from "../service/instansi.api";
import { kklKlpAPI } from "../../kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { PembimbingLapangan, CreatePembimbingLapanganInput, UpdatePembimbingLapanganInput } from "../../pembimbing-lapangan/type/pembimbing-lapangan";
import type { Instansi } from "../type/instansi";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ManagePembimbingLapanganPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const instansiId = Number(params.id);

  const [pembimbingLapangans, setPembimbingLapangans] = createSignal<PembimbingLapangan[]>([]);
  const [instansi, setInstansi] = createSignal<Instansi | null>(null);
  const [klps, setKlps] = createSignal<any[]>([]); // Filtered KLPs for this instansi
  const [periodes, setPeriodes] = createSignal<any[]>([]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPembimbing, setEditingPembimbing] = createSignal<PembimbingLapangan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [plRes, instansiRes, klpRes, periodeRes] = await Promise.all([
        pembimbingLapanganAPI.getAll(),
        instansiAPI.getById(String(instansiId)),
        kklKlpAPI.getAll(),
        kklPeriodeAPI.getAll()
      ]);

      if (instansiRes.success && instansiRes.data) {
        setInstansi(instansiRes.data);
      }

      let validKlpIds: number[] = [];
      if (klpRes.success && klpRes.data) {
        const filteredKlps = klpRes.data.filter(k => k.instansi_id === instansiId);
        setKlps(filteredKlps);
        validKlpIds = filteredKlps.map(k => k.id);
      }

      if (plRes.success && plRes.data) {
        setPembimbingLapangans(plRes.data.filter(pl => validKlpIds.includes(pl.kkl_klp_id)));
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

  const submitPembimbing = async (data: CreatePembimbingLapanganInput | UpdatePembimbingLapanganInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const submitData = { ...data };
      if (!submitData.password) {
        delete submitData.password;
      }

      const editing = editingPembimbing();
      const result = editing
        ? await pembimbingLapanganAPI.update(String(editing.id), submitData as UpdatePembimbingLapanganInput)
        : await pembimbingLapanganAPI.create(submitData as CreatePembimbingLapanganInput);

      if (result.success) {
        setToast({ type: "success", message: editing ? "Pembimbing Lapangan updated!" : "Pembimbing Lapangan created!" });
        setShowForm(false);
        setEditingPembimbing(null);
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

  const handleEdit = (pl: PembimbingLapangan) => {
    setEditingPembimbing(pl);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPembimbing(null);
    setError(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPembimbing(null);
  };

  const requestDelete = (id: string) => setDeletingId(id);

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;
    setIsLoading(true);
    try {
      const result = await pembimbingLapanganAPI.delete(id);
      if (result.success) {
        setToast({ type: "success", message: "Pembimbing Lapangan deleted!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Delete failed" });
      }
    } catch (e) {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsLoading(false);
      setDeletingId(null);
    }
  };

  const availableKlps = () => {
    const takenKlpIds = pembimbingLapangans().map(pl => pl.kkl_klp_id);
    const editingId = editingPembimbing()?.kkl_klp_id;
    return klps().filter(k => {
      if (k.id === editingId) return true;
      return !takenKlpIds.includes(k.id);
    });
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate(`/kkl-management/instansis`)}
          class="btn-secondary"
          style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Daftar Instansi
        </button>
      </div>

      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title={instansi() ? `Pembimbing Lapangan: ${instansi()?.nama}` : "Manajemen Pembimbing Lapangan"}
        description={instansi() ? `Kelola akun pembimbing lapangan KKL untuk instansi ${instansi()?.nama}.` : "Loading..."}
        action={
          <button class="btn-create" onClick={openCreateForm}>
            <IconPlusCircle />
            Buat Akun Pembimbing Baru
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Show when={klps().length === 0 && !isLoading()}>
        <div style={{ "background-color": "var(--yellow-50, #fefce8)", color: "var(--yellow-800, #854d0e)", padding: "12px", "border-radius": "8px", "margin-bottom": "20px", border: "1px solid var(--yellow-200, #fef08a)" }}>
          <strong>Peringatan:</strong> Belum ada Kelompok KKL yang ditugaskan ke Instansi ini. Anda harus membuat Kelompok KKL untuk instansi ini terlebih dahulu sebelum bisa membuat Akun Pembimbing Lapangan.
        </div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingPembimbing() ? "Edit Pembimbing Lapangan" : "Buat Akun Pembimbing Lapangan"}</h2>
            <button onClick={closeForm} class="btn-secondary" type="button">Cancel</button>
          </div>
          <PembimbingLapanganForm
            initialData={editingPembimbing() || undefined}
            klps={availableKlps()}
            instansis={instansi() ? [instansi()!] : []}
            periodes={periodes()}
            fixedInstansiId={instansiId}
            onSubmit={submitPembimbing}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Delete Pembimbing Lapangan"
        message="Are you sure you want to delete this account? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <PembimbingLapanganTable
        pembimbingLapangans={pembimbingLapangans()}
        klps={klps()}
        isLoading={isLoading()}
        canUpdate={true}
        canDelete={true}
        onEdit={handleEdit}
        onDelete={requestDelete}
      />
    </div>
  );
};

export default ManagePembimbingLapanganPage;
