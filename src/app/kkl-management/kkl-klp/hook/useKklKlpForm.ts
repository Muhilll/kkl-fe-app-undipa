import { createEffect, createSignal } from "solid-js";
import type { KklKlp, KklKlpFormData } from "../type/kkl-klp";

interface UseKklKlpFormParams {
  initialData: () => KklKlp | undefined;
}

export const useKklKlpForm = (params: UseKklKlpFormParams) => {
  const [formData, setFormData] = createSignal<KklKlpFormData>({
    nama: params.initialData()?.nama || "",
    kkl_periode_id: params.initialData()?.kkl_periode_id?.toString() || "",
    instansi_id: params.initialData()?.instansi_id?.toString() || "",
    dosen_id: params.initialData()?.dosen_id?.toString() || "",
  });

  createEffect(() => {
    const data = params.initialData();
    setFormData({
      nama: data?.nama || "",
      kkl_periode_id: data?.kkl_periode_id?.toString() || "",
      instansi_id: data?.instansi_id?.toString() || "",
      dosen_id: data?.dosen_id?.toString() || "",
    });
  });

  const handleChange = (field: keyof KklKlpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
