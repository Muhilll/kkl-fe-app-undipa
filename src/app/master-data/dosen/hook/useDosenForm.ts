import { createEffect, createSignal } from "solid-js";
import type { Dosen, DosenFormData } from "../type/dosen";

interface UseDosenFormParams {
  initialData: () => Dosen | undefined;
}

export const useDosenForm = (params: UseDosenFormParams) => {
  const [formData, setFormData] = createSignal<DosenFormData>({
    nidn: params.initialData()?.nidn || "",
    nama: params.initialData()?.nama || "",
    password: "",
    email: params.initialData()?.email || "",
    telp: params.initialData()?.telp || "",
    foto: params.initialData()?.foto || "",
    image_public_id: params.initialData()?.image_public_id || "",
  });

  createEffect(() => {
    const dosen = params.initialData();
    setFormData({
      nidn: dosen?.nidn || "",
      nama: dosen?.nama || "",
      password: "", // password won't be prefilled
      email: dosen?.email || "",
      telp: dosen?.telp || "",
      foto: dosen?.foto || "",
      image_public_id: dosen?.image_public_id || "",
    });
  });

  const handleChange = (field: keyof DosenFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
