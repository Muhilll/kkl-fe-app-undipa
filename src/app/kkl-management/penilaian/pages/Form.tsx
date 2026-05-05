import { Component, For, Show, createSignal, createEffect, createMemo } from "solid-js";
import { usePenilaianForm } from "../hook/usePenilaianForm";
import type { PenilaianFormProps } from "../type/penilaian-props";
import type { PenilaianFormData } from "../type/penilaian";

const PenilaianForm: Component<PenilaianFormProps> = (props) => {
  const isDisabled = () => props.isLoading || !!props.readOnly;
  const { formData, handleChange } = usePenilaianForm({
    initialData: () => props.initialData,
    defaultKklAgtId: props.defaultKklAgtId,
    defaultInstansiPenilaiId: props.defaultInstansiPenilaiId,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const data = formData();
    const payload = {
      kkl_agt_id: Number(data.kkl_agt_id) || 0,
      instansi_penilai_id: Number(data.instansi_penilai_id) || 0,
      lama_praktek: Number(data.lama_praktek) || 0,
      kehadiran: Number(data.kehadiran) || 0,
      disiplin: Number(data.disiplin) || 0,
      kejujuran: Number(data.kejujuran) || 0,
      kerajinan: Number(data.kerajinan) || 0,
      kerja_sama: Number(data.kerja_sama) || 0,
      sikap: Number(data.sikap) || 0,
      inisiatif: Number(data.inisiatif) || 0,
      tanggung_jawab: Number(data.tanggung_jawab) || 0,
      komunikasi: Number(data.komunikasi) || 0,
      kebersihan: Number(data.kebersihan) || 0,
      penampilan: Number(data.penampilan) || 0,
      kecakapan: Number(data.kecakapan) || 0,
    };

    const total = 
      payload.lama_praktek +
      payload.kehadiran +
      payload.disiplin +
      payload.kejujuran +
      payload.kerajinan +
      payload.kerja_sama +
      payload.sikap +
      payload.inisiatif +
      payload.tanggung_jawab +
      payload.komunikasi +
      payload.kebersihan +
      payload.penampilan +
      payload.kecakapan;

    const ratarata = (total / 13).toFixed(2);

    props.onSubmit({ ...payload, total, ratarata });
  };

  const [selectedInstansiId, setSelectedInstansiId] = createSignal<string>("");
  const [selectedPeriodeId, setSelectedPeriodeId] = createSignal<string>("");
  const [selectedKlpId, setSelectedKlpId] = createSignal<string>("");

  createEffect(() => {
    if (props.initialData || props.defaultKklAgtId) {
      const targetAgtId = props.initialData?.kkl_agt_id || props.defaultKklAgtId;
      const agt = props.agts.find((a) => a.id === targetAgtId);
      if (agt) {
        const klp = props.klps.find((k) => k.id === agt.kkl_klp_id);
        if (klp) {
          setSelectedInstansiId(klp.instansi_id.toString());
          setSelectedPeriodeId(klp.kkl_periode_id.toString());
          setSelectedKlpId(klp.id.toString());
        }
      }
    } else {
      setSelectedInstansiId("");
      setSelectedPeriodeId("");
      setSelectedKlpId("");
    }
  });

  const filteredKlps = createMemo(() => {
    if (!selectedInstansiId() || !selectedPeriodeId()) return [];
    return props.klps.filter(
      (k) =>
        k.instansi_id.toString() === selectedInstansiId() &&
        k.kkl_periode_id.toString() === selectedPeriodeId()
    );
  });

  const filteredAgts = createMemo(() => {
    if (!selectedKlpId()) return [];
    return props.agts.filter((a) => a.kkl_klp_id.toString() === selectedKlpId());
  });

  const filteredPenilais = createMemo(() => {
    if (!selectedKlpId()) return [];
    return props.penilais.filter((p) => p.kkl_klp_id.toString() === selectedKlpId());
  });

  const assessmentFields = [
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

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="instansi_id">Instansi Tujuan KKL</label>
        <select
          id="instansi_id"
          class="form-select"
          value={selectedInstansiId()}
          onChange={(e) => {
            setSelectedInstansiId(e.target.value);
            setSelectedPeriodeId("");
            setSelectedKlpId("");
            handleChange("kkl_agt_id", "");
            handleChange("instansi_penilai_id", "");
          }}
          disabled={isDisabled() || !!props.defaultKklAgtId}
          required
        >
          <option value="" disabled selected>Pilih Instansi</option>
          <For each={props.instansis}>
            {(instansi) => (
              <option value={instansi.id}>
                {instansi.nama} - {instansi.kode}
              </option>
            )}
          </For>
        </select>
      </div>

      <Show when={selectedInstansiId()}>
        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
          <label for="periode_id">Periode KKL</label>
          <select
            id="periode_id"
            class="form-select"
            value={selectedPeriodeId()}
            onChange={(e) => {
              setSelectedPeriodeId(e.target.value);
              setSelectedKlpId("");
              handleChange("kkl_agt_id", "");
              handleChange("instansi_penilai_id", "");
            }}
            disabled={isDisabled() || !!props.defaultKklAgtId}
            required
          >
            <option value="" disabled selected>Pilih Periode KKL</option>
            <For each={props.periodes}>
              {(periode) => (
                <option value={periode.id}>
                  {periode.semester} - {periode.tahun}
                </option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <Show when={selectedPeriodeId()}>
        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
          <label for="klp_id">Kelompok KKL</label>
          <select
            id="klp_id"
            class="form-select"
            value={selectedKlpId()}
            onChange={(e) => {
              setSelectedKlpId(e.target.value);
              handleChange("kkl_agt_id", "");
              handleChange("instansi_penilai_id", "");
            }}
            disabled={isDisabled() || !!props.defaultKklAgtId}
            required
          >
            <option value="" disabled selected>Pilih Kelompok KKL</option>
            <For each={filteredKlps()}>
              {(klp) => (
                <option value={klp.id}>
                  {klp.nama} - Periode: {klp.kkl_periode?.tahun}
                </option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <Show when={selectedKlpId()}>
        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
          <label for="kkl_agt_id">Mahasiswa (Anggota Kelompok KKL)</label>
          <select
            id="kkl_agt_id"
            class="form-select"
            value={formData().kkl_agt_id || ""}
            onChange={(e) => handleChange("kkl_agt_id", e.target.value)}
            disabled={isDisabled() || !!props.defaultKklAgtId}
            required
          >
            <option value="" disabled selected>Pilih Mahasiswa</option>
            <For each={filteredAgts()}>
              {(agt) => (
                <option value={agt.id}>
                  {agt.mahasiswa?.nama} ({agt.mahasiswa?.nim})
                </option>
              )}
            </For>
          </select>
        </div>

        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
          <label for="instansi_penilai_id">Instansi Penilai (Penanggung Jawab)</label>
          <select
            id="instansi_penilai_id"
            class="form-select"
            value={formData().instansi_penilai_id || ""}
            onChange={(e) => handleChange("instansi_penilai_id", e.target.value)}
            disabled={isDisabled() || !!props.defaultInstansiPenilaiId}
            required
          >
            <option value="" disabled selected>Pilih Penilai</option>
            <For each={filteredPenilais()}>
              {(penilai) => (
                <option value={penilai.id}>
                  {penilai.nama} - {penilai.jabatan}
                </option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <div style={{ "grid-column": "1 / -1", "margin-top": "16px", "margin-bottom": "8px" }}>
        <h4 style={{ "margin-bottom": "8px", "color": "var(--gray-800)" }}>Komponen Penilaian (0 - 100)</h4>
        <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px" }}>
          <For each={assessmentFields}>
            {(field) => (
              <div class="form-group">
                <label for={field.key} style={{ "font-size": "13px" }}>{field.label}</label>
                <input
                  id={field.key}
                  type="number"
                  min="0"
                  max="100"
                  class="form-input"
                  value={(formData() as any)[field.key]}
                  onInput={(e) => handleChange(field.key as keyof PenilaianFormData, e.target.value)}
                  disabled={isDisabled()}
                  required
                />
              </div>
            )}
          </For>
        </div>
      </div>

      <button type="submit" class="btn-submit" disabled={isDisabled()} style={{ "grid-column": "1 / -1", "margin-top": "16px" }}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Penilaian" : "Simpan Penilaian"}
      </button>
    </form>
  );
};

export default PenilaianForm;
