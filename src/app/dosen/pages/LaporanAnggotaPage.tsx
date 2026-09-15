import { Component, Show, createSignal, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import PageHeader from "../../../components/ui/PageHeader";
import LaporanTable from "../../kkl-management/laporan/pages/Table";
import { useAuth } from "../../../services/authStore";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { printTableToPdf } from "../../../utils/printTableToPdf";
import { formatTanggal } from "../../../utils/helpers";
import { dosenAPI } from "../../master-data/dosen/service/dosen.api";
import { kklAgtAPI } from "../../kkl-management/kkl-agt/service/kkl-agt.api";
import { kklKlpAPI } from "../../kkl-management/kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-management/kkl-periode/service/kkl-periode.api";
import { laporanAPI } from "../../kkl-management/laporan/service/laporan.api";
import type { KklAgt } from "../../kkl-management/kkl-agt/type/kkl-agt";
import type { Laporan } from "../../kkl-management/laporan/type/laporan";

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

const LaporanAnggotaPage: Component = () => {
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const permissions = usePagePermissions();
  const agtId = Number(params.agtId);

  const [agt, setAgt] = createSignal<KklAgt | null>(null);
  const [laporans, setLaporans] = createSignal<Laporan[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    const userId = auth.user()?.id;

    if (!userId || Number.isNaN(agtId)) {
      setError("Data user atau anggota tidak valid.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [dosenRes, periodeRes, klpRes, agtRes, laporanRes] = await Promise.all([
        dosenAPI.getAll(),
        kklPeriodeAPI.getAll(),
        kklKlpAPI.getAll(),
        kklAgtAPI.getById(String(agtId)),
        laporanAPI.getAll(),
      ]);

      const currentDosen = dosenRes.data?.find((item) => item.user_id === userId);
      const currentPeriode = periodeRes.data?.find((item) => item.is_active);
      const currentAgt = agtRes.data;

      if (!dosenRes.success || !currentDosen) {
        setError("Data dosen untuk user login ini tidak ditemukan.");
        return;
      }

      if (!periodeRes.success || !currentPeriode) {
        setError("Belum ada periode KKL yang aktif.");
        return;
      }

      if (!agtRes.success || !currentAgt) {
        setError("Data anggota tidak ditemukan.");
        return;
      }

      const currentKelompok = klpRes.data?.find(
        (item) =>
          item.id === currentAgt.kkl_klp_id &&
          item.dosen_id === currentDosen.id &&
          item.kkl_periode_id === currentPeriode.id,
      );

      if (!klpRes.success || !currentKelompok) {
        setError("Anggota ini tidak berada pada kelompok bimbingan Anda di periode aktif.");
        return;
      }

      setAgt(currentAgt);
      setLaporans(laporanRes.data?.filter((item) => item.kkl_agt_id === agtId) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  const handlePrint = () => {
    const studentName = agt()?.mahasiswa?.nama || "Mahasiswa";
    const studentNim = agt()?.mahasiswa?.nim || "-";

    printTableToPdf({
      title: `Data Laporan Kegiatan KKL - ${studentName}`,
      subtitle: `NIM: ${studentNim} | Total: ${laporans().length} Laporan Kegiatan`,
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
      rows: laporans().map((p, i) => [
        String(i + 1),
        p.mahasiswa?.nama || agt()?.mahasiswa?.nama || "-",
        p.mahasiswa?.nim || agt()?.mahasiswa?.nim || "-",
        formatTanggal(p.tanggal),
        p.jam,
        p.aktifitas,
        p.jarak ? `${p.jarak} m` : "-",
        p.status,
      ]),
    });
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate("/dosen/anggota-kelompok")}
          class="btn-secondary"
          style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Anggota Kelompok
        </button>
      </div>

      <PageHeader
        title={agt() ? `Laporan: ${agt()?.mahasiswa?.nama}` : "Laporan Anggota"}
        description={agt() ? `Daftar laporan KKL ${agt()?.mahasiswa?.nama} (${agt()?.mahasiswa?.nim}).` : "Memuat laporan anggota."}
        action={
          <Show when={permissions.canReport()}>
            <button
              class="btn-secondary"
              onClick={handlePrint}
              disabled={loading() || laporans().length === 0}
              title="Cetak laporan kegiatan anggota kelompok"
            >
              <IconPrinter />
              Cetak Data
            </button>
          </Show>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <LaporanTable
        laporans={laporans()}
        isLoading={loading()}
        canUpdate={false}
        canDelete={false}
        onEdit={() => undefined}
        onDelete={() => undefined}
      />
    </div>
  );
};

export default LaporanAnggotaPage;
