import { Component, Show, createSignal, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import PenilaianForm from "../../kkl-management/penilaian/pages/Form";
import { useAuth } from "../../../services/authStore";
import { pembimbingLapanganAPI } from "../../kkl-management/pembimbing-lapangan/service/pembimbing-lapangan.api";
import { instansiAPI } from "../../kkl-management/instansi/service/instansi.api";
import { kklAgtAPI } from "../../kkl-management/kkl-agt/service/kkl-agt.api";
import { kklKlpAPI } from "../../kkl-management/kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-management/kkl-periode/service/kkl-periode.api";
import { penilaianApi } from "../../kkl-management/penilaian/service/penilaian.api";
import type { PembimbingLapangan } from "../../kkl-management/pembimbing-lapangan/type/pembimbing-lapangan";
import type { KklAgt } from "../../kkl-management/kkl-agt/type/kkl-agt";
import type { KklKlp } from "../../kkl-management/kkl-klp/type/kkl-klp";
import type { Penilaian } from "../../kkl-management/penilaian/type/penilaian";

const SUCCESS_TOAST_KEY = "pembimbingLapanganSuccessToast";

const PenilaianAnggotaPembimbingPage: Component = () => {
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const agtId = Number(params.agtId);

  const [penilai, setPenilai] = createSignal<PembimbingLapangan | null>(null);
  const [agt, setAgt] = createSignal<KklAgt | null>(null);
  const [kelompok, setKelompok] = createSignal<KklKlp | null>(null);
  const [penilaian, setPenilaian] = createSignal<Penilaian | null>(null);
  const [instansis, setInstansis] = createSignal<any[]>([]);
  const [periodes, setPeriodes] = createSignal<any[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [isEditing, setIsEditing] = createSignal(false);
  const [toast, setToast] = createSignal<{ type: "success" | "error"; message: string } | null>(null);

  const clearToast = () => setToast(null);

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
      const [penilaiRes, instansiRes, periodeRes, klpRes, agtRes, penilaianRes] = await Promise.all([
        pembimbingLapanganAPI.getAll(),
        instansiAPI.getAll(),
        kklPeriodeAPI.getAll(),
        kklKlpAPI.getAll(),
        kklAgtAPI.getById(String(agtId)),
        penilaianApi.getAll(),
      ]);

      const currentUsername = auth.user()?.username;
      const currentPenilai =
        penilaiRes.data?.find(
          (item) =>
            Number(item.user_id) === userId ||
            item.virtual_account === currentUsername,
        ) || null;
      const currentPeriode = periodeRes.data?.find((item) => item.is_active) || null;
      const currentAgt = agtRes.data || null;

      if (!penilaiRes.success || !currentPenilai) {
        setError("Data pembimbing lapangan untuk user login ini tidak ditemukan.");
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

      const currentKelompok =
        klpRes.data?.find(
          (item) =>
            item.id === currentPenilai.kkl_klp_id &&
            item.id === currentAgt.kkl_klp_id &&
            item.kkl_periode_id === currentPeriode.id,
        ) || null;

      if (!klpRes.success || !currentKelompok) {
      setError("Anggota ini tidak berada pada kelompok Anda di periode aktif.");
        return;
      }

      setPenilai(currentPenilai);
      setAgt(currentAgt);
      setKelompok(currentKelompok);
      setInstansis(instansiRes.data || []);
      setPeriodes(periodeRes.data || []);
      const existingPenilaian =
        penilaianRes.data?.find(
          (item) =>
            item.kkl_agt_id === agtId &&
            item.pembimbing_id === currentPenilai.id,
        ) || null;

      setPenilaian(existingPenilaian);
      setIsEditing(!existingPenilaian);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data penilaian.");
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  const handleSubmit = async (payload: any) => {
    const currentPenilai = penilai();
    if (!currentPenilai) return;

    setLoading(true);
    setError("");

    try {
      const cleanPayload = {
        ...payload,
        kkl_agt_id: agtId,
        pembimbing_id: currentPenilai.id,
      };
      const existing = penilaian();
      const result = existing
        ? await penilaianApi.update(existing.id, cleanPayload)
        : await penilaianApi.create(cleanPayload);

      if (result.success) {
        sessionStorage.setItem(
          SUCCESS_TOAST_KEY,
          existing ? "Penilaian berhasil diperbarui." : "Penilaian berhasil disimpan.",
        );
        navigate("/pembimbing-lapangan/anggota-kelompok");
      } else {
        setToast({ type: "error", message: result.error || "Gagal menyimpan penilaian." });
      }
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan penilaian.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="user-page">
      <div style={{ "margin-bottom": "20px" }}>
        <button
          onClick={() => navigate("/pembimbing-lapangan/anggota-kelompok")}
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

      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title={agt() ? `Penilaian: ${agt()?.mahasiswa?.nama}` : "Penilaian Anggota"}
        description={agt() ? `Form penilaian untuk ${agt()?.mahasiswa?.nama} (${agt()?.mahasiswa?.nim}).` : "Memuat data anggota."}
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Show when={!error()}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{penilaian() ? "Edit Penilaian" : "Beri Penilaian"}</h2>
            <Show when={penilaian() && !isEditing()}>
              <button
                type="button"
                class="btn-secondary"
                onClick={() => setIsEditing(true)}
                disabled={loading()}
              >
                Edit
              </button>
            </Show>
          </div>
          <PenilaianForm
            initialData={penilaian() || undefined}
            agts={agt() ? [agt()!] : []}
            penilais={penilai() ? [penilai()!] : []}
            instansis={instansis()}
            klps={kelompok() ? [kelompok()!] : []}
            periodes={periodes()}
            defaultKklAgtId={agtId}
            defaultPembimbingId={penilai()?.id}
            readOnly={!!penilaian() && !isEditing()}
            onSubmit={handleSubmit}
            isLoading={loading()}
          />
        </div>
      </Show>
    </div>
  );
};

export default PenilaianAnggotaPembimbingPage;
