import { createEffect, createSignal } from "solid-js";
import type { Jurusan, JurusanFormData } from "../type/jurusan";

interface UseJurusanFormParams {
  initialData: () => Jurusan | undefined;
}

export const useJurusanForm = (params: UseJurusanFormParams) => {
  const [formData, setFormData] = createSignal<JurusanFormData>({
    kode: params.initialData()?.kode || "",
    nama: params.initialData()?.nama || "",
  });

  createEffect(() => {
    const jurusan = params.initialData();
    setFormData({
      kode: jurusan?.kode || "",
      nama: jurusan?.nama || "",
    });
  });

  const handleChange = (field: keyof JurusanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
};
