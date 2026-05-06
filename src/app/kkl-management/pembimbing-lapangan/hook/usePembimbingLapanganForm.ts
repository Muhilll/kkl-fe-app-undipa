import { createSignal, createEffect, Accessor } from "solid-js";
import type { PembimbingLapangan, CreatePembimbingLapanganInput } from "../type/pembimbing-lapangan";

interface UsePembimbingLapanganFormOptions {
  initialData: Accessor<PembimbingLapangan | undefined>;
}

const defaultFormData: CreatePembimbingLapanganInput = {
  kkl_klp_id: null,
  virtual_account: "",
  password: "",
  nama: "",
  jabatan: "",
};

export const usePembimbingLapanganForm = (options: UsePembimbingLapanganFormOptions) => {
  const [formData, setFormData] = createSignal<CreatePembimbingLapanganInput>({ ...defaultFormData });

  createEffect(() => {
    const data = options.initialData();
    if (data) {
      setFormData({
        kkl_klp_id: data.kkl_klp_id,
        virtual_account: data.virtual_account,
        password: "", // Always empty for security when editing
        nama: data.nama,
        jabatan: data.jabatan,
      });
    } else {
      setFormData({ ...defaultFormData });
    }
  });

  const handleChange = (field: keyof CreatePembimbingLapanganInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, handleChange };
};
