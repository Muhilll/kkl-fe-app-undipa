import { Component, createSignal, Show, onCleanup } from "solid-js";
import { useDosenForm } from "../hook/useDosenForm";
import { uploadImageWithSignature } from "../../../../services/uploads";
import type { DosenFormProps } from "../type/dosen-props";

const DosenForm: Component<DosenFormProps> = (props) => {
  const isEditMode = () => !!props.initialData;
  const { formData, handleChange, setFormData } = useDosenForm({
    initialData: () => props.initialData,
  });

  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal("");
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [previewUrl, setPreviewUrl] = createSignal<string>("");

  onCleanup(() => {
    if (previewUrl()) URL.revokeObjectURL(previewUrl());
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    let currentData = formData();

    if (selectedFile()) {
      setIsUploading(true);
      setUploadError("");

      try {
        const asset = await uploadImageWithSignature("dosen", selectedFile()!);
        currentData = {
          ...currentData,
          foto: asset.secureUrl,
          image_public_id: asset.publicId,
        };
        setFormData(currentData);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Failed to upload image");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    props.onSubmit(currentData);
  };

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      setSelectedFile(null);
      if (previewUrl()) URL.revokeObjectURL(previewUrl());
      setPreviewUrl("");
      return;
    }

    const file = input.files[0];
    setSelectedFile(file);
    setUploadError("");

    if (previewUrl()) URL.revokeObjectURL(previewUrl());
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="nidn">NIDN</label>
        <input
          id="nidn"
          type="text"
          value={formData().nidn}
          onChange={(e) => handleChange("nidn", e.target.value)}
          placeholder="0012345678"
          required
          disabled={props.isLoading || isUploading()}
        />
      </div>

      <div class="form-group">
        <label for="nama">Nama Lengkap</label>
        <input
          id="nama"
          type="text"
          value={formData().nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          placeholder="Dr. Budi Santoso, M.Kom"
          required
          disabled={props.isLoading || isUploading()}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData().password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={isEditMode() ? "Leave blank if unchanged" : "********"}
          required={!isEditMode()}
          disabled={props.isLoading || isUploading()}
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData().email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="budi@undipa.ac.id"
          required
          disabled={props.isLoading || isUploading()}
        />
      </div>

      <div class="form-group">
        <label for="telp">No. Telepon</label>
        <input
          id="telp"
          type="text"
          value={formData().telp}
          onChange={(e) => handleChange("telp", e.target.value)}
          placeholder="081234567890"
          disabled={props.isLoading || isUploading()}
        />
      </div>

      <div class="form-group">
        <label for="foto">Foto Dosen (Optional)</label>
        <input
          id="foto"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={props.isLoading || isUploading()}
        />
        <Show when={isUploading()}>
          <small>Uploading image...</small>
        </Show>
        <Show when={uploadError()}>
          <small style={{ color: "red" }}>{uploadError()}</small>
        </Show>
        <Show when={previewUrl() || formData().foto}>
          <div style={{ "margin-top": "8px" }}>
            <img
              src={previewUrl() || formData().foto}
              alt="Preview"
              style={{ "max-width": "100px", "border-radius": "4px" }}
            />
          </div>
        </Show>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading || isUploading()}>
        {isUploading()
          ? "Uploading..."
          : props.isLoading
          ? "Loading..."
          : props.initialData
          ? "Update Dosen"
          : "Add Dosen"}
      </button>
    </form>
  );
};

export default DosenForm;
