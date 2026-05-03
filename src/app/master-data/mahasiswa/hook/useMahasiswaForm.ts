import { createEffect, createSignal } from "solid-js";
import type { Mahasiswa, MahasiswaFormData } from "../type/mahasiswa";

interface UseMahasiswaFormParams {
  initialData: () => Mahasiswa | undefined;
}

export const useMahasiswaForm = (params: UseMahasiswaFormParams) => {
  const [formData, setFormData] = createSignal<MahasiswaFormData>({
    nim: params.initialData()?.nim || "",
    nama: params.initialData()?.nama || "",
    password: "",
    email: params.initialData()?.email || "",
    telp: params.initialData()?.telp || "",
    foto: params.initialData()?.foto || "",
    image_public_id: params.initialData()?.image_public_id || "",
    jurusan_id: String(params.initialData()?.jurusan_id || ""),
  });

  createEffect(() => {
    const mahasiswa = params.initialData();
    setFormData({
      nim: mahasiswa?.nim || "",
      nama: mahasiswa?.nama || "",
      password: "", // password won't be prefilled
      email: mahasiswa?.email || "",
      telp: mahasiswa?.telp || "",
      foto: mahasiswa?.foto || "",
      image_public_id: mahasiswa?.image_public_id || "",
      jurusan_id: mahasiswa ? String(mahasiswa.jurusan_id) : "",
    });
  });

  const handleChange = (field: keyof MahasiswaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData
  };
};
