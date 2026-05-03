import { Component, For } from "solid-js";
import { useKklKlpForm } from "../hook/useKklKlpForm";
import type { KklKlpFormProps } from "../type/kkl-klp-props";

const KklKlpForm: Component<KklKlpFormProps> = (props) => {
  const { formData, handleChange } = useKklKlpForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const availableDosens = () => {
    const usedDosenIds = props.klps
      .map(k => k.dosen_id)
      .filter(id => id !== props.initialData?.dosen_id);
    return props.dosens.filter(d => !usedDosenIds.includes(d.id));
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="nama">Nama Kelompok</label>
        <input
          id="nama"
          type="text"
          class="form-input"
          value={formData().nama}
          onInput={(e) => handleChange("nama", e.target.value)}
          placeholder="Contoh: Kelompok 1 - PT ABCD"
          disabled={props.isLoading}
          required
        />
      </div>

      <div class="form-group">
        <label for="kkl_periode_id">Periode KKL</label>
        <select
          id="kkl_periode_id"
          class="form-select"
          value={formData().kkl_periode_id}
          onChange={(e) => handleChange("kkl_periode_id", e.target.value)}
          disabled={props.isLoading}
          required
        >
          <option value="" disabled selected>Pilih Periode KKL</option>
          <For each={props.periodes}>
            {(periode) => (
              <option value={periode.id}>
                {periode.nama} ({periode.tahun} - {periode.semester})
              </option>
            )}
          </For>
        </select>
      </div>

      <div class="form-group">
        <label for="instansi_id">Instansi Tujuan</label>
        <select
          id="instansi_id"
          class="form-select"
          value={formData().instansi_id}
          onChange={(e) => handleChange("instansi_id", e.target.value)}
          disabled={props.isLoading}
          required
        >
          <option value="" disabled selected>Pilih Instansi</option>
          <For each={props.instansis}>
            {(instansi) => (
              <option value={instansi.id}>{instansi.nama}</option>
            )}
          </For>
        </select>
      </div>

      <div class="form-group">
        <label for="dosen_id">Dosen Pembimbing</label>
        <select
          id="dosen_id"
          class="form-select"
          value={formData().dosen_id}
          onChange={(e) => handleChange("dosen_id", e.target.value)}
          disabled={props.isLoading}
          required
        >
          <option value="" disabled selected>Pilih Dosen</option>
          <For each={availableDosens()}>
            {(dosen) => (
              <option value={dosen.id}>
                {dosen.nama} (NIDN: {dosen.nidn})
              </option>
            )}
          </For>
        </select>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Kelompok" : "Add Kelompok"}
      </button>
    </form>
  );
};

export default KklKlpForm;
