import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import LaporanForm from "../../laporan/pages/Form";
import LaporanTable from "../../laporan/pages/Table";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../../utils/printTableToPdf";
import { formatTanggal } from "../../../../utils/helpers";
import { laporanAPI } from "../../laporan/service/laporan.api";
import { kklKlpAPI } from "../service/kkl-klp.api";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { instansiAPI } from "../../instansi/service/instansi.api";
import { kklPeriodeAPI } from "../../kkl-periode/service/kkl-periode.api";
import type { Laporan, CreateLaporanInput, UpdateLaporanInput } from "../../laporan/type/laporan";
import type { KklKlp } from "../type/kkl-klp";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ManageLaporanKelompokPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const permissions = usePagePermissions();
  const klpId = Number(params.id);

  const [klp, setKlp] = createSignal<KklKlp | null>(null);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [allLaporans, setAllLaporans] = createSignal<Laporan[]>([]);

  // Auxiliary data for form
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [klps, setKlps] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);

  // Filtering signals
  const [selectedAgtId, setSelectedAgtId] = createSignal<string>("all");
  const [selectedStatus, setSelectedStatus] = createSignal<string>("all");
  const [searchQuery, setSearchQuery] = createSignal<string>("");

  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingLaporan, setEditingLaporan] = createSignal<Laporan | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingLaporanId, setDeletingLaporanId] = createSignal<string | null>(null);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

  const fetchData = async () => {
    if (!klpId || Number.isNaN(klpId)) {
      setError("ID Kelompok KKL tidak valid.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [klpRes, agtRes, laporanRes, instansiRes, allKlpsRes, periodeRes] = await Promise.all([
        kklKlpAPI.getById(String(klpId)),
        kklAgtAPI.getAll(),
        laporanAPI.getAll(),
        instansiAPI.getAll(),
        kklKlpAPI.getAll(),
        kklPeriodeAPI.getAll(),
      ]);

      if (klpRes.success && klpRes.data) {
        setKlp(klpRes.data);
      } else {
        setError("Kelompok KKL tidak ditemukan.");
      }

      const groupMembers = (agtRes.data || []).filter((a) => a.kkl_klp_id === klpId);
      setAgts(groupMembers);

      const memberAgtIdSet = new Set(groupMembers.map((a) => a.id));
      const groupLaporans = (laporanRes.data || []).filter((l) =>
        memberAgtIdSet.has(l.kkl_agt_id),
      );
      setAllLaporans(groupLaporans);

      if (instansiRes.success && instansiRes.data) setInstansis(instansiRes.data);
      if (allKlpsRes.success && allKlpsRes.data) setKlps(allKlpsRes.data);
      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
    } catch (e) {
      setError("Gagal memuat data laporan kelompok.");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchData);

  // Filtered reports memo
  const filteredLaporans = createMemo(() => {
    let list = allLaporans();

    const agtFilter = selectedAgtId();
    if (agtFilter && agtFilter !== "all") {
      list = list.filter((l) => l.kkl_agt_id === Number(agtFilter));
    }

    const statusFilter = selectedStatus();
    if (statusFilter && statusFilter !== "all") {
      list = list.filter((l) => l.status === statusFilter);
    }

    const q = searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.mahasiswa?.nama?.toLowerCase().includes(q) ||
          l.mahasiswa?.nim?.toLowerCase().includes(q) ||
          l.aktifitas.toLowerCase().includes(q),
      );
    }

    return list;
  });

  const handlePrint = () => {
    const groupName = klp()?.nama || "Kelompok KKL";
    const instansiName = klp()?.instansi?.nama || "-";
    const dosenName = klp()?.dosen?.nama || "-";
    const periodeName = `${klp()?.kkl_periode?.semester || ""} ${klp()?.kkl_periode?.tahun || ""}`.trim();

    printTableToPdf({
      title: `Data Laporan Kegiatan KKL - ${groupName}`,
      subtitle: `Instansi: ${instansiName} | Dosen: ${dosenName} | Periode: ${periodeName} | Total: ${filteredLaporans().length} Laporan`,
      headers: [
        "No",
        "Mahasiswa",
        "NIM",
        "Tanggal",
        "Jam",
        "Aktifitas",
        "Jarak",
        "Status",
      ],
      rows: filteredLaporans().map((p, i) => [
        String(i + 1),
        p.mahasiswa?.nama || "-",
        p.mahasiswa?.nim || "-",
        formatTanggal(p.tanggal),
        p.jam,
        p.aktifitas,
        p.jarak ? `${p.jarak} m` : "-",
        p.status,
      ]),
    });
  };

  const submitLaporan = async (data: CreateLaporanInput | UpdateLaporanInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const editing = editingLaporan();
      const result = editing
        ? await laporanAPI.update(String(editing.id), data as UpdateLaporanInput)
        : await laporanAPI.create(data as CreateLaporanInput);

      if (result.success) {
        setToast({
          type: "success",
          message: editing ? "Laporan berhasil diperbarui!" : "Laporan berhasil ditambahkan!",
        });
        setShowForm(false);
        setEditingLaporan(null);
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Operasi gagal" });
      }
    } catch (e) {
      setToast({ type: "error", message: "Terjadi kesalahan sistem" });
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
        setToast({ type: "success", message: "Laporan berhasil dihapus!" });
        await fetchData();
      } else {
        setToast({ type: "error", message: result.error || "Gagal menghapus laporan" });
      }
    } catch (e) {
      setToast({ type: "error", message: "Terjadi kesalahan sistem" });
    } finally {
      setIsLoading(false);
      setDeletingLaporanId(null);
    }
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate("/kkl-management/kkl-klps")}
          class="btn-secondary"
          style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Kelompok KKL
        </button>
      </div>

      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title={klp() ? `Laporan: ${klp()?.nama}` : "Laporan Kelompok KKL"}
        description={
          klp()
            ? `Daftar seluruh laporan kegiatan mahasiswa pada kelompok ${klp()?.nama}.`
            : "Memuat laporan kelompok..."
        }
        action={
          <div style={{ display: "flex", gap: "10px" }}>
            <Show when={permissions.canReport()}>
              <button
                class="btn-secondary"
                onClick={handlePrint}
                disabled={isLoading() || filteredLaporans().length === 0}
                title="Cetak seluruh laporan kelompok"
              >
                <IconPrinter />
                Cetak Data
              </button>
            </Show>
            <Show when={permissions.canCreate() && agts().length > 0}>
              <button class="btn-create" onClick={openCreateForm}>
                <IconPlusCircle />
                Add New Laporan
              </button>
            </Show>
          </div>
        }
      />

      <Show when={error()}>
        <div class="error-message" style={{ "margin-bottom": "20px" }}>
          {error()}
        </div>
      </Show>

      {/* Info Group Summary Banner */}
      <Show when={klp()}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--gray-200)",
            "border-radius": "12px",
            padding: "20px 24px",
            "margin-bottom": "24px",
            "box-shadow": "var(--shadow-sm)",
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <span style={{ "font-size": "12px", color: "var(--gray-500)", display: "block" }}>
              Kelompok & Periode
            </span>
            <strong style={{ "font-size": "15px", color: "var(--gray-900)" }}>
              {klp()?.nama}
            </strong>
            <span style={{ "font-size": "12px", color: "var(--gray-600)", display: "block" }}>
              {klp()?.kkl_periode?.semester} ({klp()?.kkl_periode?.tahun})
            </span>
          </div>

          <div>
            <span style={{ "font-size": "12px", color: "var(--gray-500)", display: "block" }}>
              Lokasi Instansi
            </span>
            <strong style={{ "font-size": "14px", color: "var(--gray-900)" }}>
              {klp()?.instansi?.nama || "-"}
            </strong>
          </div>

          <div>
            <span style={{ "font-size": "12px", color: "var(--gray-500)", display: "block" }}>
              Dosen Pembimbing
            </span>
            <strong style={{ "font-size": "14px", color: "var(--gray-900)" }}>
              {klp()?.dosen?.nama || "-"}
            </strong>
            <span style={{ "font-size": "12px", color: "var(--gray-600)", display: "block" }}>
              NIDN: {klp()?.dosen?.nidn || "-"}
            </span>
          </div>

          <div>
            <span style={{ "font-size": "12px", color: "var(--gray-500)", display: "block" }}>
              Statistik Laporan
            </span>
            <strong style={{ "font-size": "15px", color: "var(--brand-800)" }}>
              {allLaporans().length} Laporan
            </strong>
            <span style={{ "font-size": "12px", color: "var(--gray-600)", display: "block" }}>
              dari {agts().length} Anggota Mahasiswa
            </span>
          </div>
        </div>
      </Show>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          "flex-wrap": "wrap",
          gap: "14px",
          "align-items": "center",
          "justify-content": "space-between",
          "margin-bottom": "20px",
          background: "#ffffff",
          padding: "16px 20px",
          border: "1px solid var(--gray-200)",
          "border-radius": "12px",
          "box-shadow": "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            gap: "16px",
            "align-items": "center",
          }}
        >
          {/* Member filter */}
          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <label
              style={{
                "font-size": "13px",
                "font-weight": "600",
                color: "var(--gray-700)",
                "white-space": "nowrap",
              }}
            >
              Anggota:
            </label>
            <select
              class="form-select"
              style={{ "min-width": "220px", width: "auto" }}
              value={selectedAgtId()}
              onChange={(e) => setSelectedAgtId(e.currentTarget.value)}
            >
              <option value="all">Semua Anggota ({agts().length})</option>
              <For each={agts()}>
                {(a) => (
                  <option value={String(a.id)}>
                    {a.mahasiswa?.nama} ({a.mahasiswa?.nim})
                  </option>
                )}
              </For>
            </select>
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", "align-items": "center", gap: "8px" }}>
            <label
              style={{
                "font-size": "13px",
                "font-weight": "600",
                color: "var(--gray-700)",
                "white-space": "nowrap",
              }}
            >
              Status:
            </label>
            <select
              class="form-select"
              style={{ "min-width": "140px", width: "auto" }}
              value={selectedStatus()}
              onChange={(e) => setSelectedStatus(e.currentTarget.value)}
            >
              <option value="all">Semua Status</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>
        </div>

        {/* Search box with modern styling */}
        <div
          style={{
            position: "relative",
            "min-width": "260px",
            flex: "1",
            "max-width": "360px",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gray-400)",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              "pointer-events": "none",
            }}
          >
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Cari mahasiswa atau kegiatan..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            style={{
              width: "100%",
              height: "40px",
              "padding-left": "38px",
              "padding-right": searchQuery() ? "34px" : "12px",
              border: "1px solid var(--gray-300)",
              "border-radius": "var(--radius-sm, 6px)",
              "font-size": "13.5px",
              "font-family": "var(--font)",
              color: "var(--gray-800)",
              background: "#ffffff",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
              "box-sizing": "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--brand-600)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(239, 68, 68, 0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--gray-300)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <Show when={searchQuery()}>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--gray-400)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              }}
              title="Hapus pencarian"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </Show>
        </div>
      </div>

      {/* Modal for editing/adding */}
      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingLaporan() ? "Edit Laporan" : "Add New Laporan"}</h2>
            <button onClick={closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <LaporanForm
            initialData={editingLaporan() || undefined}
            agts={agts()}
            instansis={instansis()}
            klps={klps()}
            periodes={periodes()}
            defaultKklAgtId={agts()[0]?.id}
            onSubmit={submitLaporan}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingLaporanId()}
        title="Delete Laporan"
        message="Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel={isLoading() ? "Menghapus..." : "Hapus"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLaporanId(null)}
      />

      <LaporanTable
        laporans={filteredLaporans()}
        isLoading={isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={handleEdit}
        onDelete={requestDelete}
      />
    </div>
  );
};

export default ManageLaporanKelompokPage;
