import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import PageHeader from "../../../../components/ui/PageHeader";
import { useAuth } from "../../../../services/authStore";
import { mahasiswaAPI } from "../../../master-data/mahasiswa/service/mahasiswa.api";
import { kklAgtAPI } from "../../../kkl-management/kkl-agt/service/kkl-agt.api";
import { laporanAPI } from "../../../kkl-management/laporan/service/laporan.api";
import LaporanTable from "../../../kkl-management/laporan/pages/Table";
import type { Mahasiswa } from "../../../master-data/mahasiswa/type/mahasiswa";
import type { KklAgt } from "../../../kkl-management/kkl-agt/type/kkl-agt";
import type { Laporan } from "../../../kkl-management/laporan/type/laporan";

const MahasiswaLaporanPage: Component = () => {
  const auth = useAuth();
  const [mahasiswa, setMahasiswa] = createSignal<Mahasiswa | null>(null);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [laporans, setLaporans] = createSignal<Laporan[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    const user = auth.user();

    if (!user?.id) {
      setError("Data user login tidak ditemukan.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [mahasiswaRes, agtRes, laporanRes] = await Promise.all([
        mahasiswaAPI.getAll(),
        kklAgtAPI.getAll(),
        laporanAPI.getAll(),
      ]);

      const currentMahasiswa =
        mahasiswaRes.data?.find(
          (item) => Number(item.user_id) === Number(user.id) || item.nim === user.username,
        ) || null;

      if (!mahasiswaRes.success || !currentMahasiswa) {
        setError("Data mahasiswa untuk user login ini tidak ditemukan.");
        return;
      }

      const currentAgts =
        agtRes.data?.filter(
          (item) => Number(item.mahasiswa_id) === Number(currentMahasiswa.id),
        ) || [];
      const currentAgtIds = new Set(currentAgts.map((item) => Number(item.id)));

      setMahasiswa(currentMahasiswa);
      setAgts(currentAgts);
      setLaporans(
        laporanRes.data?.filter((item) => currentAgtIds.has(Number(item.kkl_agt_id))) || [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  const periodeLabel = createMemo(() => {
    const periode = agts()[0]?.kkl_klp?.kkl_periode;
    if (!periode) return "-";
    return `${periode.nama} (${periode.tahun} - ${periode.semester})`;
  });

  const instansi = createMemo(() => agts()[0]?.kkl_klp?.instansi);

  return (
    <div class="user-page">
      <PageHeader
        title="Laporan KKL Saya"
        description="Daftar laporan kegiatan KKL yang sudah Anda kirim."
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <div class="form-section">
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div>
            <h3 style={{ "margin-top": 0, "margin-bottom": "15px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "10px" }}>
              Informasi Mahasiswa
            </h3>
            <Show when={!loading()} fallback={<p style={{ color: "var(--gray-500)" }}>Loading info...</p>}>
              <p style={{ margin: "0 0 10px 0" }}>
                <strong>Mahasiswa:</strong><br />
                {mahasiswa()?.nama || "-"} ({mahasiswa()?.nim || "-"})
              </p>
              <p style={{ margin: "0" }}>
                <strong>Periode/Kelompok:</strong><br />
                {periodeLabel()}
              </p>
            </Show>
          </div>

          <div>
            <h3 style={{ "margin-top": 0, "margin-bottom": "15px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "10px" }}>
              Tempat KKL (Instansi)
            </h3>
            <Show when={!loading()} fallback={<p style={{ color: "var(--gray-500)" }}>Loading info...</p>}>
              <Show when={instansi()} fallback={<p style={{ color: "var(--gray-500)", margin: "0" }}>Belum ada instansi KKL</p>}>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>Nama Instansi:</strong><br />
                  {instansi()?.nama || "-"}
                </p>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>Alamat:</strong><br />
                  {instansi()?.alamat || "-"}
                </p>
                <p style={{ margin: "0 0 10px 0" }}>
                  <strong>No. Telepon:</strong><br />
                  {instansi()?.telp || "-"}
                </p>
                <Show when={instansi()?.latitude && instansi()?.longitude}>
                  <a
                    href={`https://www.google.com/maps?q=${instansi()?.latitude},${instansi()?.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                    style={{ display: "inline-flex", "align-items": "center", gap: "6px", "text-decoration": "none", "font-size": "13px", padding: "6px 12px" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Lihat Lokasi
                  </a>
                </Show>
              </Show>
            </Show>
          </div>
        </div>
      </div>

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

export default MahasiswaLaporanPage;
