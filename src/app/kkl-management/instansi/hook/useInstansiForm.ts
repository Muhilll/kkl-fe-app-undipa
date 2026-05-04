import { createEffect, createSignal } from "solid-js";
import type { Instansi, InstansiFormData } from "../type/instansi";

interface UseInstansiFormParams {
  initialData: () => Instansi | undefined;
}

export const useInstansiForm = (params: UseInstansiFormParams) => {
  const [formData, setFormData] = createSignal<InstansiFormData>({
    kode: params.initialData()?.kode || "",
    nama: params.initialData()?.nama || "",
    alamat: params.initialData()?.alamat || "",
    telp: params.initialData()?.telp || "",
    latitude: params.initialData()?.latitude || "",
    longitude: params.initialData()?.longitude || "",
  });

  createEffect(() => {
    const instansi = params.initialData();
    setFormData({
      kode: instansi?.kode || "",
      nama: instansi?.nama || "",
      alamat: instansi?.alamat || "",
      telp: instansi?.telp || "",
      latitude: instansi?.latitude || "",
      longitude: instansi?.longitude || "",
    });
  });

  const handleChange = (field: keyof InstansiFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
