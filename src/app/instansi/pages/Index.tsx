import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import PageHeader from "../../../components/ui/PageHeader";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import { instansiAPI } from "../../kkl-management/instansi/service/instansi.api";
import { kklAgtAPI } from "../../kkl-management/kkl-agt/service/kkl-agt.api";
import { kklKlpAPI } from "../../kkl-management/kkl-klp/service/kkl-klp.api";
import { kklPeriodeAPI } from "../../kkl-management/kkl-periode/service/kkl-periode.api";
import type { Instansi } from "../../kkl-management/instansi/type/instansi";
import type { KklAgt } from "../../kkl-management/kkl-agt/type/kkl-agt";
import type { KklKlp } from "../../kkl-management/kkl-klp/type/kkl-klp";
import type { KklPeriode } from "../../kkl-management/kkl-periode/type/kkl-periode";

type InstansiKklRow = Instansi & {
  kelompok: KklKlp[];
  anggota: KklAgt[];
};

const InstansiListPage: Component = () => {
  const [instansis, setInstansis] = createSignal<Instansi[]>([]);
  const [klps, setKlps] = createSignal<KklKlp[]>([]);
  const [agts, setAgts] = createSignal<KklAgt[]>([]);
  const [periodes, setPeriodes] = createSignal<KklPeriode[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [instansiRes, periodeRes, klpRes, agtRes] = await Promise.all([
        instansiAPI.getAll(),
        kklPeriodeAPI.getAll(),
        kklKlpAPI.getAll(),
        kklAgtAPI.getAll(),
      ]);

      if (instansiRes.success && instansiRes.data) setInstansis(instansiRes.data);
      if (periodeRes.success && periodeRes.data) setPeriodes(periodeRes.data);
      if (klpRes.success && klpRes.data) setKlps(klpRes.data);
      if (agtRes.success && agtRes.data) setAgts(agtRes.data);

      if (!instansiRes.success || !periodeRes.success || !klpRes.success || !agtRes.success) {
        setError(
          instansiRes.error ||
            periodeRes.error ||
            klpRes.error ||
            agtRes.error ||
            "Gagal memuat data instansi KKL.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data instansi KKL.");
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  const activePeriode = createMemo(
    () => periodes().find((periode) => periode.is_active) || null,
  );

  const rows = createMemo<InstansiKklRow[]>(() => {
    const periode = activePeriode();
    const activeKlps = periode
      ? klps().filter((klp) => Number(klp.kkl_periode_id) === Number(periode.id))
      : [];

    return instansis().map((instansi) => {
      const kelompok = activeKlps.filter(
        (klp) => Number(klp.instansi_id) === Number(instansi.id),
      );
      const kelompokIds = new Set(kelompok.map((klp) => Number(klp.id)));
      const anggota = agts().filter((agt) => kelompokIds.has(Number(agt.kkl_klp_id)));

      return {
        ...instansi,
        kelompok,
        anggota,
      };
    });
  });

  const columns: DataTableColumn<InstansiKklRow>[] = [
    { header: "No", cell: (_, index) => <>{index + 1}</>, sortValue: (row) => row.id },
    { header: "Kode", cell: (row) => <>{row.kode}</>, sortValue: (row) => row.kode },
    { header: "Instansi", cell: (row) => <>{row.nama}</>, sortValue: (row) => row.nama },
    {
      header: "Alamat",
      cell: (row) => <span class="instansi-address">{row.alamat}</span>,
      sortValue: (row) => row.alamat,
    },
    {
      header: "Anggota Kelompok KKL",
      cell: (row) => (
        <Show
          when={row.anggota.length > 0}
          fallback={<span class="instansi-empty-members">Belum ada anggota</span>}
        >
          <ol class="instansi-member-list">
            <For each={row.anggota}>
              {(agt) => <li>{agt.mahasiswa?.nama || "-"}</li>}
            </For>
          </ol>
        </Show>
      ),
      sortValue: (row) => row.anggota.map(a => a.mahasiswa?.nama || "").join(" "),
    },
  ];

  return (
    <div class="user-page">
      <PageHeader
        title="Daftar Instansi KKL"
        description={
          activePeriode()
            ? `Instansi dan anggota kelompok pada periode ${activePeriode()!.nama}.`
            : "Instansi dan anggota kelompok pada periode KKL aktif."
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <div class="form-section instansi-active-period">
        <span>Periode KKL Aktif</span>
        <strong>
          {activePeriode()
            ? `${activePeriode()!.nama} (${activePeriode()!.tahun} - ${activePeriode()!.semester})`
            : "Belum ada periode aktif"}
        </strong>
      </div>

      <DataTable
        rows={rows()}
        columns={columns}
        isLoading={loading()}
        emptyMessage="Belum ada data instansi."
        itemsPerPage={10}
      />

      <style>{`
        .instansi-active-period {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .instansi-active-period span {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .instansi-active-period strong {
          color: var(--gray-900);
          font-size: 15px;
          text-align: right;
        }

        .instansi-address {
          display: block;
          min-width: 360px;
          line-height: 1.55;
          color: var(--gray-700);
        }

        .instansi-member-list {
          min-width: 260px;
          margin: 0;
          padding-left: 20px;
          line-height: 1.55;
          color: var(--gray-700);
        }

        .instansi-empty-members {
          color: var(--gray-400);
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .instansi-active-period {
            align-items: flex-start;
            flex-direction: column;
          }

          .instansi-active-period strong {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default InstansiListPage;
