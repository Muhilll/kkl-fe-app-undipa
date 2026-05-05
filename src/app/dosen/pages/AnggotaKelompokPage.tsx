import { Component, For, Show, createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../../../services/authStore";
import { dosenAPI } from "../../master-data/dosen/service/dosen.api";
import { kklAgtAPI } from "../../kkl-management/kkl-agt/service/kkl-agt.api";
import { kklKlpAPI } from "../../kkl-management/kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-management/kkl-periode/service/kkl-periode.api";
import type { Dosen } from "../../master-data/dosen/type/dosen";
import type { KklAgt } from "../../kkl-management/kkl-agt/type/kkl-agt";
import type { KklKlp } from "../../kkl-management/kkl-klp/type/kkl-klp";
import type { KklPeriode } from "../../kkl-management/kkl-periode/type/kkl-periode";

const IconLaporan = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const AnggotaKelompokPage: Component = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [dosen, setDosen] = createSignal<Dosen | null>(null);
  const [activePeriode, setActivePeriode] = createSignal<KklPeriode | null>(null);
  const [kelompok, setKelompok] = createSignal<KklKlp | null>(null);
  const [anggota, setAnggota] = createSignal<KklAgt[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    const userId = auth.user()?.id;

    if (!userId) {
      setError("Data user login tidak ditemukan.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [dosenRes, periodeRes, klpRes, agtRes] = await Promise.all([
        dosenAPI.getAll(),
        kklPeriodeAPI.getAll(),
        kklKlpAPI.getAll(),
        kklAgtAPI.getAll(),
      ]);

      const currentDosen = dosenRes.data?.find((item) => item.user_id === userId) || null;
      if (!dosenRes.success || !currentDosen) {
        setError("Data dosen untuk user login ini tidak ditemukan.");
        return;
      }
      setDosen(currentDosen);

      const currentPeriode = periodeRes.data?.find((item) => item.is_active) || null;
      if (!periodeRes.success || !currentPeriode) {
        setError("Belum ada periode KKL yang aktif.");
        return;
      }
      setActivePeriode(currentPeriode);

      const currentKelompok =
        klpRes.data?.find(
          (item) =>
            item.dosen_id === currentDosen.id &&
            item.kkl_periode_id === currentPeriode.id,
        ) || null;

      if (!klpRes.success || !currentKelompok) {
        setKelompok(null);
        setAnggota([]);
        return;
      }

      setKelompok(currentKelompok);
      setAnggota(
        agtRes.data?.filter((item) => item.kkl_klp_id === currentKelompok.id) || [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data anggota kelompok.");
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  return (
    <div class="user-page">
      <PageHeader
        title="Anggota Kelompok Bimbingan"
        description="Daftar mahasiswa pada kelompok KKL periode aktif untuk dosen yang sedang login."
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <div style={{ display: "grid", "grid-template-columns": "1fr 2fr", gap: "20px" }}>
        <div class="form-section">
          <h3 style={{ "margin-top": 0, "margin-bottom": "15px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "10px" }}>
            Informasi Kelompok
          </h3>
          <Show when={!loading()} fallback={<p style={{ color: "var(--gray-500)" }}>Loading info...</p>}>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Dosen:</strong><br />
              {dosen()?.nama || "-"}
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Periode Aktif:</strong><br />
              {activePeriode()
                ? `${activePeriode()!.nama} (${activePeriode()!.tahun} - ${activePeriode()!.semester})`
                : "-"}
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Kelompok:</strong><br />
              {kelompok()?.nama || "-"}
            </p>
            <p style={{ margin: "0" }}>
              <strong>Instansi:</strong><br />
              {kelompok()?.instansi?.nama || "-"}
            </p>
          </Show>
        </div>

        <div class="form-section">
          <h3 style={{ "font-size": "16px", "margin-bottom": "10px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "8px" }}>
            Daftar Anggota ({anggota().length})
          </h3>

          <Show when={loading() && anggota().length === 0}>
            <p style={{ "text-align": "center", color: "var(--gray-500)", padding: "20px" }}>Loading data...</p>
          </Show>

          <Show when={!loading() && !kelompok() && !error()}>
            <p style={{ "text-align": "center", color: "var(--gray-500)", padding: "20px" }}>
              Anda belum memiliki kelompok pada periode KKL aktif.
            </p>
          </Show>

          <Show when={!loading() && kelompok() && anggota().length === 0}>
            <p style={{ "text-align": "center", color: "var(--gray-500)", padding: "20px" }}>
              Belum ada anggota di kelompok ini.
            </p>
          </Show>

          <Show when={anggota().length > 0}>
            <ul style={{ "list-style": "none", padding: 0, margin: 0 }}>
              <For each={anggota()}>
                {(agt) => (
                  <li style={{
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "center",
                    padding: "12px",
                    "border-bottom": "1px solid var(--gray-200)",
                    gap: "12px",
                  }}>
                    <div>
                      <span style={{ "font-weight": "600", display: "block" }}>{agt.mahasiswa?.nama}</span>
                      <span style={{ "font-size": "13px", color: "var(--gray-500)" }}>NIM: {agt.mahasiswa?.nim}</span>
                    </div>
                    <button
                      type="button"
                      class="btn-icon btn-edit"
                      onClick={() => navigate(`/dosen/anggota-kelompok/${agt.id}/laporan`)}
                      disabled={loading()}
                      title="Lihat Laporan"
                    >
                      <IconLaporan />
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default AnggotaKelompokPage;
