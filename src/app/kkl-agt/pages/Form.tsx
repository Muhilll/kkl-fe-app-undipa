import { Component, For, Show, createSignal, createEffect, createMemo } from "solid-js";
import { useKklAgtForm } from "../hook/useKklAgtForm";
import type { KklAgtFormProps } from "../type/kkl-agt-props";

const KklAgtForm: Component<KklAgtFormProps> = (props) => {
  const { formData, handleChange } = useKklAgtForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const [selectedInstansiId, setSelectedInstansiId] = createSignal<string>("");
  const [selectedPeriodeId, setSelectedPeriodeId] = createSignal<string>("");

  createEffect(() => {
    if (props.initialData) {
      const klpId = props.initialData.kkl_klp_id;
      const klp = props.klps.find(k => k.id === klpId);
      if (klp) {
        setSelectedInstansiId(klp.instansi_id?.toString() || "");
        setSelectedPeriodeId(klp.kkl_periode_id?.toString() || "");
      }
    } else {
      setSelectedInstansiId("");
      setSelectedPeriodeId("");
    }
  });

  const filteredKlps = createMemo(() => {
    if (!selectedInstansiId() || !selectedPeriodeId()) return [];
    return props.klps.filter(
      (k) =>
        k.instansi_id?.toString() === selectedInstansiId() &&
        k.kkl_periode_id?.toString() === selectedPeriodeId()
    );
  });

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
            handleChange("kkl_klp_id", 0 as any);
          }}
          disabled={props.isLoading}
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
              handleChange("kkl_klp_id", 0 as any);
            }}
            disabled={props.isLoading}
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
          <label for="kkl_klp_id">Kelompok KKL (Dosen Pembimbing)</label>
          <select
            id="kkl_klp_id"
            class="form-select"
            value={formData().kkl_klp_id || ""}
            onChange={(e) => handleChange("kkl_klp_id", e.target.value)}
            disabled={props.isLoading}
            required
          >
            <option value="" disabled selected>Pilih Kelompok KKL</option>
            <For each={filteredKlps()}>
              {(klp) => (
                <option value={klp.id}>
                  {klp.nama} - {klp.dosen?.nama} ({klp.dosen?.nidn})
                </option>
              )}
            </For>
          </select>
        </div>
      </Show>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="mahasiswa_id">Mahasiswa</label>
        <select
          id="mahasiswa_id"
          class="form-select"
          value={formData().mahasiswa_id || ""}
          onChange={(e) => handleChange("mahasiswa_id", e.target.value)}
          disabled={props.isLoading || !!props.initialData}
          required
        >
          <option value="" disabled selected>Pilih Mahasiswa</option>
          <For each={props.mahasiswas}>
            {(mahasiswa) => (
              <option value={mahasiswa.id}>
                {mahasiswa.nama} ({mahasiswa.nim})
              </option>
            )}
          </For>
        </select>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Anggota" : "Add Anggota"}
      </button>
    </form>
  );
};

export default KklAgtForm;
