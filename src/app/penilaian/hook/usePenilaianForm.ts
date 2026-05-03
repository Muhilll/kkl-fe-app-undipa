import { createSignal, createEffect } from "solid-js";
import type { Penilaian, PenilaianFormData } from "../type/penilaian";

interface UsePenilaianFormOptions {
  initialData?: () => Penilaian | undefined;
  defaultKklAgtId?: number;
}

export const usePenilaianForm = (options: UsePenilaianFormOptions) => {
  const [formData, setFormData] = createSignal<PenilaianFormData>({
    kkl_agt_id: options.initialData?.()?.kkl_agt_id?.toString() || options.defaultKklAgtId?.toString() || "",
    instansi_penilai_id: options.initialData?.()?.instansi_penilai_id?.toString() || "",
    lama_praktek: options.initialData?.()?.lama_praktek?.toString() || "",
    kehadiran: options.initialData?.()?.kehadiran?.toString() || "",
    disiplin: options.initialData?.()?.disiplin?.toString() || "",
    kejujuran: options.initialData?.()?.kejujuran?.toString() || "",
    kerajinan: options.initialData?.()?.kerajinan?.toString() || "",
    kerja_sama: options.initialData?.()?.kerja_sama?.toString() || "",
    sikap: options.initialData?.()?.sikap?.toString() || "",
    inisiatif: options.initialData?.()?.inisiatif?.toString() || "",
    tanggung_jawab: options.initialData?.()?.tanggung_jawab?.toString() || "",
    komunikasi: options.initialData?.()?.komunikasi?.toString() || "",
    kebersihan: options.initialData?.()?.kebersihan?.toString() || "",
    penampilan: options.initialData?.()?.penampilan?.toString() || "",
    kecakapan: options.initialData?.()?.kecakapan?.toString() || "",
  });

  createEffect(() => {
    const data = options.initialData?.();
    setFormData({
      kkl_agt_id: data?.kkl_agt_id?.toString() || options.defaultKklAgtId?.toString() || "",
      instansi_penilai_id: data?.instansi_penilai_id?.toString() || "",
      lama_praktek: data?.lama_praktek?.toString() || "",
      kehadiran: data?.kehadiran?.toString() || "",
      disiplin: data?.disiplin?.toString() || "",
      kejujuran: data?.kejujuran?.toString() || "",
      kerajinan: data?.kerajinan?.toString() || "",
      kerja_sama: data?.kerja_sama?.toString() || "",
      sikap: data?.sikap?.toString() || "",
      inisiatif: data?.inisiatif?.toString() || "",
      tanggung_jawab: data?.tanggung_jawab?.toString() || "",
      komunikasi: data?.komunikasi?.toString() || "",
      kebersihan: data?.kebersihan?.toString() || "",
      penampilan: data?.penampilan?.toString() || "",
      kecakapan: data?.kecakapan?.toString() || "",
    });
  });

  const handleChange = (field: keyof PenilaianFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
