import { createSignal, createEffect, Accessor } from "solid-js";
import type { Laporan, CreateLaporanInput } from "../type/laporan";

interface UseLaporanFormOptions {
  initialData: Accessor<Laporan | undefined>;
  defaultKklAgtId?: number;
}

const defaultFormData: CreateLaporanInput = {
  kkl_agt_id: 0,
  tanggal: "",
  jam: "",
  aktifitas: "",
  file: null,
  file_public_id: null,
  latitude: null,
  longitude: null,
  jarak: null,
  status: "valid",
};

export const useLaporanForm = (options: UseLaporanFormOptions) => {
  const [formData, setFormData] = createSignal<CreateLaporanInput>({ 
    ...defaultFormData,
    kkl_agt_id: options.defaultKklAgtId || 0
  });

  createEffect(() => {
    const data = options.initialData();
    if (data) {
      setFormData({
        kkl_agt_id: data.kkl_agt_id,
        tanggal: data.tanggal ? data.tanggal.split('T')[0] : "",
        jam: data.jam,
        aktifitas: data.aktifitas,
        file: data.file,
        file_public_id: data.file_public_id,
        latitude: data.latitude,
        longitude: data.longitude,
        jarak: data.jarak,
        status: data.status,
      });
    } else {
      setFormData({ 
        ...defaultFormData,
        kkl_agt_id: options.defaultKklAgtId || 0
      });
    }
  });

  const handleChange = (field: keyof CreateLaporanInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return { formData, handleChange, setFormData };
};
