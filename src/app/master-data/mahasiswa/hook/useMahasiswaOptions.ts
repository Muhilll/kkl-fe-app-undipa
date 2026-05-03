import { createSignal, onMount } from "solid-js";
import { lookupAPI } from "../../../../services/lookups";
import type { Jurusan } from "../../jurusan/type/jurusan";

export const useMahasiswaOptions = () => {
  const [jurusans, setJurusans] = createSignal<Jurusan[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(true);

  onMount(async () => {
    setIsOptionsLoading(true);
    try {
      const jurusansRes = await lookupAPI.getJurusans();

      if (jurusansRes.success && jurusansRes.data) {
        setJurusans(jurusansRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch mahasiswa options", error);
    } finally {
      setIsOptionsLoading(false);
    }
  });

  return { jurusans, isOptionsLoading };
};
