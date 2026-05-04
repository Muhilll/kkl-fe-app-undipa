export type Laporan = {
  id: number;
  kkl_agt_id: number;
  tanggal: string;
  jam: string;
  aktifitas: string;
  file: string | null;
  latitude: string | null;
  longitude: string | null;
  jarak: string | null;
  status: "valid" | "invalid";
  created_at: string;
  updated_at: string;
  mahasiswa?: {
    id: number;
    nama: string;
    nim: string;
  } | null;
};

export type CreateLaporanInput = {
  kkl_agt_id: number;
  tanggal: string;
  jam: string;
  aktifitas: string;
  file?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  jarak?: string | null;
  status: "valid" | "invalid";
};

export type UpdateLaporanInput = Partial<CreateLaporanInput>;
