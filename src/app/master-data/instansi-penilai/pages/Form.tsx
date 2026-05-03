import { Component, For, Show } from "solid-js";
import { useInstansiPenilaiForm } from "../hook/useInstansiPenilaiForm";
import type { InstansiPenilaiFormProps } from "../type/instansi-penilai-props";

const InstansiPenilaiForm: Component<InstansiPenilaiFormProps> = (props) => {
  const { formData, handleChange } = useInstansiPenilaiForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const handleGenerateVA = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const va = `VA${randomNum}`;
    handleChange("virtual_account", va);
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="kkl_klp_id">Kelompok KKL (Instansi Tujuan)</label>
        <select
          id="kkl_klp_id"
          class="form-select"
          value={formData().kkl_klp_id || ""}
          onChange={(e) => handleChange("kkl_klp_id", Number(e.target.value) || null)}
          disabled={props.isLoading || !!props.initialData}
          required
        >
          <option value="" disabled selected>Pilih Kelompok KKL</option>
          <For each={props.klps}>
            {(klp) => (
              <option value={klp.id}>
                {klp.instansi?.nama || "Tanpa Instansi"} - {klp.nama} - {klp.dosen?.nama} ({klp.dosen?.nidn}) - Periode: {klp.kkl_periode?.semester} - {klp.kkl_periode?.tahun}
              </option>
            )}
          </For>
        </select>
        <Show when={props.initialData}>
          <small style={{ color: "var(--gray-500)", "margin-top": "4px", display: "block" }}>
            Kelompok KKL tidak bisa diubah setelah akun Instansi Penilai dibuat.
          </small>
        </Show>
      </div>

      <div class="form-group">
        <label for="nama">Nama PIC / Penilai</label>
        <input
          id="nama"
          type="text"
          class="form-input"
          value={formData().nama}
          onInput={(e) => handleChange("nama", e.target.value)}
          placeholder="Contoh: Budi Santoso"
          disabled={props.isLoading}
          required
        />
      </div>

      <div class="form-group">
        <label for="jabatan">Jabatan</label>
        <input
          id="jabatan"
          type="text"
          class="form-input"
          value={formData().jabatan}
          onInput={(e) => handleChange("jabatan", e.target.value)}
          placeholder="Contoh: Manager HRD"
          disabled={props.isLoading}
          required
        />
      </div>

      <div class="form-group">
        <label for="virtual_account">Virtual Account (Username)</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            id="virtual_account"
            type="text"
            class="form-input"
            value={formData().virtual_account}
            onInput={(e) => handleChange("virtual_account", e.target.value)}
            placeholder="Contoh: VA-12345"
            disabled={props.isLoading || !!props.initialData}
            required
            style={{ flex: 1 }}
          />
          <Show when={!props.initialData}>
            <button
              type="button"
              onClick={handleGenerateVA}
              disabled={props.isLoading}
              class="btn-secondary"
              style={{ padding: "0 12px", "white-space": "nowrap" }}
            >
              Generate
            </button>
          </Show>
        </div>
        <Show when={props.initialData}>
          <small style={{ color: "var(--gray-500)", "margin-top": "4px", display: "block" }}>
            Virtual Account tidak bisa diubah.
          </small>
        </Show>
      </div>

      <div class="form-group">
        <label for="password">Password {props.initialData && "(Kosongkan jika tidak ingin diubah)"}</label>
        <input
          id="password"
          type="password"
          class="form-input"
          value={formData().password || ""}
          onInput={(e) => handleChange("password", e.target.value)}
          placeholder={props.initialData ? "Tulis untuk mereset password" : "Buat password..."}
          disabled={props.isLoading}
          required={!props.initialData} // Required on create, optional on update
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading} style={{ "grid-column": "1 / -1" }}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Akun Penilai" : "Buat Akun Penilai"}
      </button>
    </form>
  );
};

export default InstansiPenilaiForm;
