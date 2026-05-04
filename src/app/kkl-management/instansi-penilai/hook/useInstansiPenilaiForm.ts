import { createSignal, createEffect, Accessor } from "solid-js";
import type { InstansiPenilai, CreateInstansiPenilaiInput } from "../type/instansi-penilai";

interface UseInstansiPenilaiFormOptions {
  initialData: Accessor<InstansiPenilai | undefined>;
}

const defaultFormData: CreateInstansiPenilaiInput = {
  kkl_klp_id: null,
  virtual_account: "",
  password: "",
  nama: "",
  jabatan: "",
};

export const useInstansiPenilaiForm = (options: UseInstansiPenilaiFormOptions) => {
  const [formData, setFormData] = createSignal<CreateInstansiPenilaiInput>({ ...defaultFormData });

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

  const handleChange = (field: keyof CreateInstansiPenilaiInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, handleChange };
};
