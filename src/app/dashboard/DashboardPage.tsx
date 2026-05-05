/**
 * Dashboard Page
 * Main dashboard for the application
 */

import { Component, createMemo, createSignal, onMount } from "solid-js";
import { useAuth } from "../../services/authStore";
import PageHeader from "../../components/ui/PageHeader";
import { kklPeriodeAPI } from "../kkl-management/kkl-periode/service/kkl-periode.api";
import { kklKlpAPI } from "../kkl-management/kkl-klp/service/kkl-klp.api";
import { kklAgtAPI } from "../kkl-management/kkl-agt/service/kkl-agt.api";
import type { KklPeriode } from "../kkl-management/kkl-periode/type/kkl-periode";
import type { KklKlp } from "../kkl-management/kkl-klp/type/kkl-klp";
import type { KklAgt } from "../kkl-management/kkl-agt/type/kkl-agt";

const DashboardPage: Component = () => {
  const auth = useAuth();
  const [periodes, setPeriodes] = createSignal<KklPeriode[]>([]);
  const [klps, setKlps] = createSignal<KklKlp[]>([]);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchStats = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [periodeRes, klpRes, agtRes] = await Promise.all([
        kklPeriodeAPI.getAll(),
        kklKlpAPI.getAll(),
        kklAgtAPI.getAll(),
      ]);

      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
      if (klpRes.success && klpRes.data) setKlps(klpRes.data);
      if (agtRes.success && agtRes.data) setAgts(agtRes.data);

      const failedMessage =
        periodeRes.error || klpRes.error || agtRes.error || "";
      if (!periodeRes.success || !klpRes.success || !agtRes.success) {
        setError(failedMessage || "Gagal memuat statistik dashboard.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat statistik dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchStats);

  const activePeriode = createMemo(
    () => periodes().find((periode) => periode.is_active) || null,
  );

  const activeKlps = createMemo(() => {
    const periode = activePeriode();
    if (!periode) return [];
    return klps().filter((klp) => Number(klp.kkl_periode_id) === Number(periode.id));
  });

  const activeAgtCount = createMemo(() => {
    const activeKlpIds = new Set(activeKlps().map((klp) => Number(klp.id)));
    return agts().filter((agt) => activeKlpIds.has(Number(agt.kkl_klp_id))).length;
  });

  const activeInstansiCount = createMemo(() => {
    const instansiIds = new Set(activeKlps().map((klp) => Number(klp.instansi_id)));
    return instansiIds.size;
  });

  const stats = createMemo(() => [
    {
      label: "Periode Aktif",
      value: activePeriode()
        ? `${activePeriode()!.tahun} ${activePeriode()!.semester}`
        : "-",
      meta: activePeriode()?.nama || "Belum ada periode aktif",
    },
    {
      label: "Kelompok KKL",
      value: activeKlps().length,
      meta: "Kelompok pada periode aktif",
    },
    {
      label: "Mahasiswa KKL",
      value: activeAgtCount(),
      meta: "Mahasiswa tergabung dalam kelompok",
    },
    {
      label: "Instansi KKL",
      value: activeInstansiCount(),
      meta: "Instansi unik pada periode aktif",
    },
  ]);

  return (
    <div class="user-page">
      <PageHeader
        title="Dashboard"
        description={`Selamat datang, ${auth.user()?.username || "User"}. Ringkasan KKL periode aktif.`}
      />

      <div class="dashboard-active-period">
        <div>
          <span class="dashboard-eyebrow">Periode KKL Aktif</span>
          <h2>{activePeriode()?.nama || "Belum ada periode aktif"}</h2>
          <p>
            {activePeriode()
              ? `${activePeriode()!.tahun} - ${activePeriode()!.semester}`
              : "Aktifkan satu periode KKL untuk menampilkan statistik berjalan."}
          </p>
        </div>
        <button
          type="button"
          class="btn-secondary"
          onClick={fetchStats}
          disabled={isLoading()}
        >
          {isLoading() ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {error() && <div class="error-message">{error()}</div>}

      <div class="dashboard-stat-grid">
        {stats().map((item) => (
          <div class="dashboard-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.meta}</p>
          </div>
        ))}
      </div>

      <style>{`
        .dashboard-active-period {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 22px 24px;
          margin-bottom: 22px;
          background: #fff;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
        }

        .dashboard-eyebrow {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dashboard-active-period h2 {
          margin: 0;
          color: var(--gray-900);
          font-size: 22px;
          line-height: 1.35;
        }

        .dashboard-active-period p {
          margin: 4px 0 0;
          color: var(--gray-500);
          font-size: 14px;
        }

        .dashboard-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .dashboard-stat-card {
          min-height: 148px;
          padding: 18px;
          background: #fff;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
        }

        .dashboard-stat-card span {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .dashboard-stat-card strong {
          color: var(--brand-800);
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
        }

        .dashboard-stat-card p {
          margin: 0;
          color: var(--gray-500);
          font-size: 13px;
          line-height: 1.45;
        }

        @media (max-width: 960px) {
          .dashboard-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .dashboard-active-period {
            align-items: stretch;
            flex-direction: column;
          }

          .dashboard-stat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
