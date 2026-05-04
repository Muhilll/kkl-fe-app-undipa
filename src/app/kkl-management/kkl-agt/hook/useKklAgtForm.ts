import { createEffect, createSignal } from "solid-js";
import type { KklAgt, KklAgtFormData } from "../type/kkl-agt";

interface UseKklAgtFormParams {
  initialData: () => KklAgt | undefined;
}

export const useKklAgtForm = (params: UseKklAgtFormParams) => {
  const [formData, setFormData] = createSignal<KklAgtFormData>({
    kkl_klp_id: params.initialData()?.kkl_klp_id?.toString() || "",
    mahasiswa_id: params.initialData()?.mahasiswa_id?.toString() || "",
  });

  createEffect(() => {
    const data = params.initialData();
    setFormData({
      kkl_klp_id: data?.kkl_klp_id?.toString() || "",
      mahasiswa_id: data?.mahasiswa_id?.toString() || "",
    });
  });

  const handleChange = (field: keyof KklAgtFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
