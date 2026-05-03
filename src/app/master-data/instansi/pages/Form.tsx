import { Component } from "solid-js";
import { useInstansiForm } from "../hook/useInstansiForm";
import type { InstansiFormProps } from "../type/instansi-props";
import MapSelector from "../../../../components/ui/MapSelector";

const InstansiForm: Component<InstansiFormProps> = (props) => {
  const { formData, handleChange } = useInstansiForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="kode">Kode Instansi</label>
        <input
          id="kode"
          type="text"
          value={formData().kode}
          onChange={(e) => handleChange("kode", e.target.value)}
          placeholder="INS-001"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="nama">Nama Instansi</label>
        <input
          id="nama"
          type="text"
          value={formData().nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          placeholder="PT Makmur Jaya"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="alamat">Alamat</label>
        <textarea
          id="alamat"
          class="form-textarea"
          value={formData().alamat}
          onChange={(e) => handleChange("alamat", e.target.value)}
          placeholder="Jl. Perintis Kemerdekaan No. 10"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="telp">No. Telepon</label>
        <input
          id="telp"
          type="text"
          value={formData().telp}
          onChange={(e) => handleChange("telp", e.target.value)}
          placeholder="0411-123456"
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="latitude">Latitude (Otomatis dari Peta)</label>
        <input
          id="latitude"
          type="text"
          value={formData().latitude}
          onChange={(e) => handleChange("latitude", e.target.value)}
          placeholder="-5.147665"
          disabled={true}
        />
      </div>

      <div class="form-group">
        <label for="longitude">Longitude (Otomatis dari Peta)</label>
        <input
          id="longitude"
          type="text"
          value={formData().longitude}
          onChange={(e) => handleChange("longitude", e.target.value)}
          placeholder="119.432732"
          disabled={true}
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <MapSelector
          latitude={formData().latitude}
          longitude={formData().longitude}
          onChange={(lat, lng) => {
            handleChange("latitude", lat);
            handleChange("longitude", lng);
          }}
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Instansi" : "Add Instansi"}
      </button>
    </form>
  );
};

export default InstansiForm;
