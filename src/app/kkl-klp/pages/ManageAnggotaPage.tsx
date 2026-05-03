import { Component, createSignal, createEffect, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import PageHeader from "../../../components/ui/PageHeader";
import { kklKlpAPI } from "../service/kkl-klp.api";
import { kklAgtAPI } from "../../kkl-agt/service/kkl-agt.api";
import { mahasiswaAPI } from "../../master-data/mahasiswa/service/mahasiswa.api";
import type { KklKlp } from "../type/kkl-klp";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";

const ManageAnggotaPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const klpId = Number(params.id);

  const [klp, setKlp] = createSignal<KklKlp | null>(null);
  const [allAgts, setAllAgts] = createSignal<KklAgt[]>([]);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [mahasiswas, setMahasiswas] = createSignal<any[]>([]);
  const [selectedMhs, setSelectedMhs] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [klpRes, agtRes, mhsRes] = await Promise.all([
        kklKlpAPI.getById(String(klpId)),
        kklAgtAPI.getAll(),
        mahasiswaAPI.getAll()
      ]);

      if (klpRes.success && klpRes.data) {
        setKlp(klpRes.data);
      } else {
        setError("Kelompok KKL tidak ditemukan.");
      }

      if (agtRes.success && agtRes.data) {
        setAllAgts(agtRes.data);
        setAgts(agtRes.data.filter((a) => a.kkl_klp_id === klpId));
      }
      if (mhsRes.success && mhsRes.data) {
        setMahasiswas(mhsRes.data);
      }
    } catch (e) {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchData();
  });

  const handleAdd = async (e: Event) => {
    e.preventDefault();
    if (!selectedMhs() || !klpId) return;
    setLoading(true);
    setError("");
    try {
      const res = await kklAgtAPI.create({
        kkl_klp_id: klpId,
        mahasiswa_id: Number(selectedMhs())
      });
      if (res.success) {
        setSelectedMhs("");
        await fetchData();
      } else {
        setError(res.error || "Gagal menambahkan anggota");
      }
    } catch (e) {
      setError("Terjadi kesalahan saat menambahkan anggota");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mahasiswa ini dari kelompok?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await kklAgtAPI.delete(String(id));
      if (res.success) {
        await fetchData();
      } else {
        setError(res.error || "Gagal menghapus anggota");
      }
    } catch (e) {
      setError("Terjadi kesalahan saat menghapus anggota");
    } finally {
      setLoading(false);
    }
  };

  const availableMahasiswas = () => {
    const usedMhsIds = allAgts().map(a => a.mahasiswa_id);
    return mahasiswas().filter(m => !usedMhsIds.includes(m.id));
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate("/kkl-klps")}
          class="btn-secondary"
          style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Daftar Kelompok
        </button>
      </div>

      <PageHeader
        title="Manajemen Anggota Kelompok"
        description="Pilih mahasiswa untuk dimasukkan ke dalam kelompok KKL ini."
      />

      <Show when={error()}>
        <div class="error-message" style={{ "margin-bottom": "16px" }}>{error()}</div>
      </Show>

      <div style={{ display: "grid", "grid-template-columns": "1fr 2fr", gap: "20px" }}>
        <div class="form-section">
          <h3 style={{ "margin-top": 0, "margin-bottom": "15px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "10px" }}>
            Informasi Kelompok
          </h3>
          <Show when={!loading() && klp()}>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Periode:</strong><br />
              {klp()?.kkl_periode?.nama} ({klp()?.kkl_periode?.tahun})
            </p>
            <p style={{ margin: "0 0 10px 0" }}>
              <strong>Instansi:</strong><br />
              {klp()?.instansi?.nama}
            </p>
            <p style={{ margin: "0" }}>
              <strong>Pembimbing:</strong><br />
              {klp()?.dosen?.nama}
            </p>
          </Show>
          <Show when={loading() && !klp()}>
            <p style={{ color: "var(--gray-500)" }}>Loading info...</p>
          </Show>
        </div>

        <div class="form-section">
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", "margin-bottom": "20px" }}>
            <select
              class="form-select"
              value={selectedMhs()}
              onChange={(e) => setSelectedMhs(e.target.value)}
              disabled={loading()}
              required
              style={{ flex: 1 }}
            >
              <option value="" disabled selected>-- Tambah Mahasiswa ke Kelompok --</option>
              <For each={availableMahasiswas()}>
                {(mhs) => (
                  <option value={mhs.id}>{mhs.nim} - {mhs.nama}</option>
                )}
              </For>
            </select>
            <button type="submit" class="btn-submit" disabled={loading() || !selectedMhs()} style={{ width: "auto" }}>
              {loading() ? "Loading..." : "Tambah"}
            </button>
          </form>

          <h3 style={{ "font-size": "16px", "margin-bottom": "10px", "border-bottom": "1px solid var(--gray-200)", "padding-bottom": "8px" }}>
            Daftar Anggota Saat Ini ({agts().length})
          </h3>

          <Show when={loading() && agts().length === 0}>
            <p style={{ "text-align": "center", color: "var(--gray-500)", padding: "20px" }}>Loading data...</p>
          </Show>

          <Show when={!loading() && agts().length === 0 && klp()}>
            <p style={{ "text-align": "center", color: "var(--gray-500)", padding: "20px" }}>Belum ada anggota di kelompok ini.</p>
          </Show>

          <Show when={agts().length > 0}>
            <ul style={{ "list-style": "none", padding: 0, margin: 0 }}>
              <For each={agts()}>
                {(agt) => (
                  <li style={{
                    display: "flex",
                    "justify-content": "space-between",
                    "align-items": "center",
                    padding: "12px",
                    "border-bottom": "1px solid var(--gray-200)"
                  }}>
                    <div>
                      <span style={{ "font-weight": "600", display: "block" }}>{agt.mahasiswa?.nama}</span>
                      <span style={{ "font-size": "13px", color: "var(--gray-500)" }}>NIM: {agt.mahasiswa?.nim}</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/kkl-klps/${klpId}/anggota/${agt.id}/laporan`)}
                        disabled={loading()}
                        title="Lihat Laporan"
                        style={{
                          padding: "6px 10px",
                          "background-color": "var(--blue-50)",
                          color: "var(--blue-600)",
                          border: "1px solid var(--blue-200)",
                          "border-radius": "6px",
                          cursor: loading() ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          "align-items": "center",
                          "justify-content": "center"
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/kkl-klps/${klpId}/anggota/${agt.id}/penilaian`)}
                        disabled={loading()}
                        title="Lihat Penilaian"
                        style={{
                          padding: "6px 10px",
                          "background-color": "var(--green-50)",
                          color: "var(--green-600)",
                          border: "1px solid var(--green-200)",
                          "border-radius": "6px",
                          cursor: loading() ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          "align-items": "center",
                          "justify-content": "center"
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(agt.id)}
                        disabled={loading()}
                        title="Hapus Anggota"
                        style={{
                          padding: "6px 10px",
                          "background-color": "var(--red-50)",
                          color: "var(--red-600)",
                          border: "1px solid var(--red-200)",
                          "border-radius": "6px",
                          cursor: loading() ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          "align-items": "center",
                          "justify-content": "center"
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
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

export default ManageAnggotaPage;
