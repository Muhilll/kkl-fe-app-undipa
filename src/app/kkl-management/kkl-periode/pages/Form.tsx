import { Component } from "solid-js";
import { useKklPeriodeForm } from "../hook/useKklPeriodeForm";
import type { KklPeriodeFormProps } from "../type/kkl-periode-props";

const KklPeriodeForm: Component<KklPeriodeFormProps> = (props) => {
  const { formData, handleChange } = useKklPeriodeForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="nama">Nama Periode</label>
        <input
          id="nama"
          type="text"
          value={formData().nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          placeholder="e.g. KKL Angkatan 2024"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="tahun">Tahun</label>
        <input
          id="tahun"
          type="number"
          min="2000"
          max="2099"
          value={formData().tahun}
          onChange={(e) => handleChange("tahun", e.target.value)}
          placeholder="2024"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="semester">Semester</label>
        <select
          id="semester"
          class="form-select"
          value={formData().semester}
          onChange={(e) => handleChange("semester", e.target.value as "ganjil" | "genap")}
          disabled={props.isLoading}
          required
        >
          <option value="ganjil">Ganjil</option>
          <option value="genap">Genap</option>
        </select>
      </div>

      <div class="form-group">
        <label for="max_agt_klp">Maks. Anggota per Kelompok</label>
        <input
          id="max_agt_klp"
          type="number"
          min="1"
          max="50"
          value={formData().max_agt_klp}
          onChange={(e) => handleChange("max_agt_klp", e.target.value)}
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData().is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
            disabled={props.isLoading}
          />
          Is Active
        </label>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Periode" : "Add Periode"}
      </button>
    </form>
  );
};

export default KklPeriodeForm;
