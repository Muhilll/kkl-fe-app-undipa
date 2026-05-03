import { Component, For, Show, createSignal, createEffect, createMemo } from "solid-js";
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
    } else if (props.fixedInstansiId) {
      setSelectedInstansiId(props.fixedInstansiId.toString());
      setSelectedPeriodeId("");
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
          disabled={props.isLoading || !!props.fixedInstansiId}
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
          <label for="kkl_klp_id">Kelompok KKL (Instansi Tujuan)</label>
          <select
            id="kkl_klp_id"
            class="form-select"
            value={formData().kkl_klp_id || ""}
            onChange={(e) => handleChange("kkl_klp_id", Number(e.target.value) || null)}
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
