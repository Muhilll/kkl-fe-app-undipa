import { Component } from "solid-js";
import { useJurusanForm } from "../hook/useJurusanForm";
import type { JurusanFormProps } from "../type/jurusan-props";

const JurusanForm: Component<JurusanFormProps> = (props) => {
  const { formData, handleChange } = useJurusanForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="kode">Kode</label>
        <input
          id="kode"
          type="text"
          value={formData().kode}
          onChange={(e) => handleChange("kode", e.target.value)}
          placeholder="SI"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="nama">Nama</label>
        <input
          id="nama"
          type="text"
          value={formData().nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          placeholder="Sistem Informasi"
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Jurusan" : "Add Jurusan"}
      </button>
    </form>
  );
};

export default JurusanForm;
