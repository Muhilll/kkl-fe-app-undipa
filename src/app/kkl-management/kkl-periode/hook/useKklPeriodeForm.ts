import { createEffect, createSignal } from "solid-js";
import type { KklPeriode, KklPeriodeFormData } from "../type/kkl-periode";

interface UseKklPeriodeFormParams {
  initialData: () => KklPeriode | undefined;
}

export const useKklPeriodeForm = (params: UseKklPeriodeFormParams) => {
  const currentYear = new Date().getFullYear().toString();

  const [formData, setFormData] = createSignal<KklPeriodeFormData>({
    nama: params.initialData()?.nama || "",
    tahun: params.initialData()?.tahun || currentYear,
    semester: params.initialData()?.semester || "ganjil",
    max_agt_klp: params.initialData()?.max_agt_klp || 5,
  });

  createEffect(() => {
    const data = params.initialData();
    setFormData({
      nama: data?.nama || "",
      tahun: data?.tahun || currentYear,
      semester: data?.semester || "ganjil",
      max_agt_klp: data?.max_agt_klp || 5,
    });
  });

  const handleChange = (field: keyof KklPeriodeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
