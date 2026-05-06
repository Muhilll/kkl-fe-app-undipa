import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import PageHeader from "../../../../components/ui/PageHeader";
import { useAuth } from "../../../../services/authStore";
import { mahasiswaAPI } from "../../../master-data/mahasiswa/service/mahasiswa.api";
import { kklAgtAPI } from "../../../kkl-management/kkl-agt/service/kkl-agt.api";
import { penilaianApi } from "../../../kkl-management/penilaian/service/penilaian.api";
import type { Mahasiswa } from "../../../master-data/mahasiswa/type/mahasiswa";
import type { KklAgt } from "../../../kkl-management/kkl-agt/type/kkl-agt";
import type { Penilaian } from "../../../kkl-management/penilaian/type/penilaian";

const assessmentFields: Array<{ key: keyof Penilaian; label: string }> = [
  { key: "lama_praktek", label: "Lama Praktek" },
  { key: "kehadiran", label: "Kehadiran" },
  { key: "disiplin", label: "Disiplin" },
  { key: "kejujuran", label: "Kejujuran" },
  { key: "kerajinan", label: "Kerajinan" },
  { key: "kerja_sama", label: "Kerja Sama" },
  { key: "sikap", label: "Sikap" },
  { key: "inisiatif", label: "Inisiatif" },
  { key: "tanggung_jawab", label: "Tanggung Jawab" },
  { key: "komunikasi", label: "Komunikasi" },
  { key: "kebersihan", label: "Kebersihan" },
  { key: "penampilan", label: "Penampilan" },
  { key: "kecakapan", label: "Kecakapan" },
];

const getHuruf = (ratarataStr: string) => {
  const score = Number(ratarataStr);
  if (Number.isNaN(score)) return "-";
  if (score >= 86) return "A";
  if (score >= 81) return "A-";
  if (score >= 76) return "B+";
  if (score >= 71) return "B";
  if (score >= 66) return "B-";
  if (score >= 61) return "C+";
  if (score >= 56) return "C";
  if (score >= 41) return "D";
  return "E";
};

const MahasiswaPenilaianPage: Component = () => {
  const auth = useAuth();
  const [mahasiswa, setMahasiswa] = createSignal<Mahasiswa | null>(null);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [penilaians, setPenilaians] = createSignal<Penilaian[]>([]);
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
      const [mahasiswaRes, agtRes, penilaianRes] = await Promise.all([
        mahasiswaAPI.getAll(),
        kklAgtAPI.getAll(),
        penilaianApi.getAll(),
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
      setPenilaians(
        penilaianRes.data?.filter((item) => currentAgtIds.has(Number(item.kkl_agt_id))) || [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data penilaian.");
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

  const firstPenilaian = createMemo(() => penilaians()[0] || null);

  return (
    <div class="user-page">
      <PageHeader
        title="Penilaian KKL Saya"
        description="Daftar nilai KKL yang sudah diberikan oleh pembimbing lapangan."
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

      <Show when={loading()}>
        <div class="form-section">
          <p style={{ color: "var(--gray-500)", margin: 0 }}>Loading data penilaian...</p>
        </div>
      </Show>

      <Show when={!loading() && !error() && !firstPenilaian()}>
        <div class="form-section">
          <p style={{ color: "var(--gray-500)", margin: 0 }}>
            Nilai KKL Anda belum tersedia.
          </p>
        </div>
      </Show>

      <Show when={!loading() && firstPenilaian()}>
        {(penilaian) => (
          <div class="student-assessment">
            <div class="form-section student-final-result">
              <h3>Hasil Akhir Penilaian</h3>
              <div class="student-assessment-summary">
                <div>
                  <span>Nilai Total</span>
                  <strong>{penilaian().total}</strong>
                </div>
                <div>
                  <span>Rata-rata</span>
                  <strong>{penilaian().ratarata}</strong>
                </div>
                <div>
                  <span>Nilai Huruf</span>
                  <strong>{getHuruf(penilaian().ratarata)}</strong>
                </div>
              </div>
            </div>

            <div class="student-score-grid">
              <For each={assessmentFields}>
                {(field) => (
                  <div class="student-score-item">
                    <span>{field.label}</span>
                    <strong>{String(penilaian()[field.key] ?? "-")}</strong>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </Show>

      <style>{`
        .student-assessment {
          display: grid;
          gap: 18px;
        }

        .student-assessment-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .student-final-result h3 {
          margin: 0 0 16px;
          color: var(--gray-900);
          font-size: 16px;
        }

        .student-assessment-summary > div,
        .student-score-item {
          padding: 18px;
          background: #fff;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .student-assessment-summary span,
        .student-score-item span {
          display: block;
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .student-assessment-summary strong {
          display: block;
          margin-top: 12px;
          color: var(--brand-800);
          font-size: 34px;
          line-height: 1;
        }

        .student-score-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
        }

        .student-score-item strong {
          display: block;
          margin-top: 10px;
          color: var(--gray-900);
          font-size: 24px;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .student-assessment-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MahasiswaPenilaianPage;
