import { Component, For, createEffect, createMemo, createSignal, Show, onCleanup } from "solid-js";
import { useLaporanForm } from "../hook/useLaporanForm";
import type { LaporanFormProps } from "../type/laporan-props";
import MapSelector from "../../../../components/ui/MapSelector";
import { haversineDistance } from "../../../../utils/helpers";
import { uploadImageWithSignature } from "../../../../services/uploads";



const LaporanForm: Component<LaporanFormProps> = (props) => {
  const { formData, handleChange, setFormData } = useLaporanForm({
    initialData: () => props.initialData,
    defaultKklAgtId: props.defaultKklAgtId,
  });

  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal("");
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    let currentData = formData();

    if (selectedFile()) {
      setIsUploading(true);
      setUploadError("");

      try {
        const asset = await uploadImageWithSignature("laporan", selectedFile()!);
        currentData = {
          ...currentData,
          file: asset.secureUrl, // File URL dari Cloudinary
        };
        setFormData(currentData);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Failed to upload file");
        setIsUploading(false);
        return; // Stop submission
      }
      setIsUploading(false);
    }

    props.onSubmit(currentData);
  };

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = input.files[0];
    setSelectedFile(file);
    setUploadError("");
  };

  const [selectedInstansiId, setSelectedInstansiId] = createSignal<string>("");
  const [selectedPeriodeId, setSelectedPeriodeId] = createSignal<string>("");
  const [selectedKlpId, setSelectedKlpId] = createSignal<string>("");

  createEffect(() => {
    if (props.initialData || props.defaultKklAgtId) {
      const targetAgtId = props.initialData?.kkl_agt_id || props.defaultKklAgtId;
      const agt = props.agts.find((a) => a.id === targetAgtId);
      if (agt && agt.kkl_klp) {
        // Find the klp in props.klps to get instansi_id reliably, or just use agt.kkl_klp.instansi_id if available.
        // The API might nest instansi under agt.kkl_klp.instansi
        const klp = props.klps.find(k => k.id === agt.kkl_klp.id);
        if (klp) {
          setSelectedInstansiId(klp.instansi_id.toString());
          setSelectedPeriodeId(klp.kkl_periode_id.toString());
          setSelectedKlpId(klp.id.toString());
        } else if (agt.kkl_klp.instansi?.id) {
          setSelectedInstansiId(agt.kkl_klp.instansi.id.toString());
          if (agt.kkl_klp.kkl_periode_id) setSelectedPeriodeId(agt.kkl_klp.kkl_periode_id.toString());
          setSelectedKlpId(agt.kkl_klp.id.toString());
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
        k.instansi_id?.toString() === selectedInstansiId() &&
        k.kkl_periode_id?.toString() === selectedPeriodeId()
    );
  });

  const filteredAgts = createMemo(() => {
    if (!selectedKlpId()) return [];
    return props.agts.filter((a) => a.kkl_klp_id?.toString() === selectedKlpId());
  });

  // Cari instansi dari anggota KKL yang dipilih
  const selectedInstansi = createMemo(() => {
    const agtId = formData().kkl_agt_id;
    if (!agtId) return null;
    const agt = props.agts.find((a) => a.id === agtId);
    return agt?.kkl_klp?.instansi || null;
  });

  // Auto-hitung jarak menggunakan Haversine setiap kali lat/lng atau anggota berubah
  createEffect(() => {
    const lat = formData().latitude;
    const lng = formData().longitude;
    const inst = selectedInstansi();

    if (lat && lng && inst?.latitude && inst?.longitude) {
      const distanceKm = haversineDistance(
        parseFloat(lat), parseFloat(lng),
        parseFloat(inst.latitude), parseFloat(inst.longitude)
      );
      const distanceMeters = distanceKm * 1000;
      const newJarak = distanceMeters.toFixed(2);
      const newStatus = distanceMeters <= 500 ? "valid" : "invalid";

      if (formData().jarak !== newJarak) {
        handleChange("jarak", newJarak);
      }
      if (formData().status !== newStatus) {
        handleChange("status", newStatus);
      }
    } else {
      if (formData().jarak !== null) {
        handleChange("jarak", null);
      }
    }
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
            setSelectedKlpId("");
            handleChange("kkl_agt_id", 0 as any); // Reset to empty/0
          }}
          disabled={props.isLoading || !!props.defaultKklAgtId}
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
              handleChange("kkl_agt_id", 0 as any);
            }}
            disabled={props.isLoading || !!props.defaultKklAgtId}
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
              handleChange("kkl_agt_id", 0 as any);
            }}
            disabled={props.isLoading || !!props.defaultKklAgtId}
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
          <label for="kkl_agt_id">Anggota KKL (Mahasiswa)</label>
          <select
            id="kkl_agt_id"
            class="form-select"
            value={formData().kkl_agt_id || ""}
            onChange={(e) => handleChange("kkl_agt_id", Number(e.target.value))}
            disabled={props.isLoading || !!props.defaultKklAgtId}
            required
          >
            <option value="" disabled selected>Pilih Anggota KKL</option>
            <For each={filteredAgts()}>
              {(agt) => (
                <option value={agt.id}>
                  {agt.mahasiswa?.nama} ({agt.mahasiswa?.nim})
                </option>
              )}
            </For>
          </select>
        </div>
      </Show>

      {selectedInstansi() && (
        <div style={{
          "grid-column": "1 / -1",
          padding: "10px 14px",
          "background-color": "var(--blue-50, #eff6ff)",
          "border-radius": "8px",
          "border": "1px solid var(--blue-200, #bfdbfe)",
          "margin-bottom": "16px",
          "font-size": "13px",
          color: "var(--blue-800, #1e40af)",
        }}>
          <strong>Instansi Tujuan:</strong> {selectedInstansi()!.nama}
          {selectedInstansi()!.latitude && selectedInstansi()!.longitude && (
            <span> — Koordinat: {selectedInstansi()!.latitude}, {selectedInstansi()!.longitude}</span>
          )}
        </div>
      )}

      <div class="form-group">
        <label for="tanggal">Tanggal</label>
        <input
          id="tanggal"
          type="date"
          class="form-input"
          value={formData().tanggal}
          onInput={(e) => handleChange("tanggal", e.target.value)}
          disabled={props.isLoading}
          required
        />
      </div>

      <div class="form-group">
        <label for="jam">Jam</label>
        <input
          id="jam"
          type="time"
          class="form-input"
          value={formData().jam}
          onInput={(e) => handleChange("jam", e.target.value)}
          disabled={props.isLoading}
          required
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="aktifitas">Aktifitas</label>
        <textarea
          id="aktifitas"
          class="form-textarea"
          value={formData().aktifitas}
          onInput={(e) => handleChange("aktifitas", e.target.value)}
          disabled={props.isLoading}
          required
          rows={4}
        />
      </div>

      <div class="form-group">
        <label for="file">File (Dokumen/Foto)</label>
        <input
          id="file"
          type="file"
          onChange={handleFileChange}
          disabled={props.isLoading || isUploading()}
        />
        <Show when={isUploading()}>
          <small>Uploading file...</small>
        </Show>
        <Show when={uploadError()}>
          <small style={{ color: "red" }}>{uploadError()}</small>
        </Show>
        <Show when={formData().file && !selectedFile()}>
          <div style={{ "margin-top": "8px", "font-size": "13px" }}>
            <a href={formData().file!} target="_blank" rel="noopener noreferrer">Lihat File Saat Ini</a>
          </div>
        </Show>
      </div>

      <div class="form-group">
        <label for="latitude">Latitude (Otomatis dari Peta)</label>
        <input
          id="latitude"
          type="text"
          class="form-input"
          value={formData().latitude || ""}
          onInput={(e) => handleChange("latitude", e.target.value || null)}
          disabled={true}
          placeholder="-5.14766500"
        />
      </div>

      <div class="form-group">
        <label for="longitude">Longitude (Otomatis dari Peta)</label>
        <input
          id="longitude"
          type="text"
          class="form-input"
          value={formData().longitude || ""}
          onInput={(e) => handleChange("longitude", e.target.value || null)}
          disabled={true}
          placeholder="119.43273200"
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <MapSelector
          latitude={formData().latitude || ""}
          longitude={formData().longitude || ""}
          onChange={(lat, lng) => {
            handleChange("latitude", lat);
            handleChange("longitude", lng);
          }}
          disabled={props.isLoading}
          targetLatitude={selectedInstansi()?.latitude || undefined}
          targetLongitude={selectedInstansi()?.longitude || undefined}
          targetTitle={selectedInstansi()?.nama || undefined}
        />
      </div>

      <div class="form-group">
        <label for="jarak">Jarak ke Instansi (meter) — Otomatis dihitung</label>
        <input
          id="jarak"
          type="text"
          class="form-input"
          value={formData().jarak || ""}
          disabled
          placeholder="Pilih lokasi dan anggota KKL untuk menghitung jarak"
          style={{ "background-color": "var(--gray-100, #f3f4f6)", cursor: "not-allowed" }}
        />
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select
          id="status"
          class="form-select"
          value={formData().status}
          onChange={(e) => handleChange("status", e.target.value)}
          disabled={true}
          required
        >
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
        </select>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading || isUploading()}>
        {isUploading() ? "Uploading..." : props.isLoading ? "Loading..." : props.initialData ? "Update Laporan" : "Add Laporan"}
      </button>
    </form>
  );
};

export default LaporanForm;
