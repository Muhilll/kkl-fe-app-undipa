export interface Penilaian {
  id: number;
  kkl_agt_id: number;
  instansi_penilai_id: number;
  lama_praktek: number;
  kehadiran: number;
  disiplin: number;
  kejujuran: number;
  kerajinan: number;
  kerja_sama: number;
  sikap: number;
  inisiatif: number;
  tanggung_jawab: number;
  komunikasi: number;
  kebersihan: number;
  penampilan: number;
  kecakapan: number;
  total: number;
  ratarata: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePenilaianInput {
  kkl_agt_id: number;
  instansi_penilai_id: number;
  lama_praktek: number;
  kehadiran: number;
  disiplin: number;
  kejujuran: number;
  kerajinan: number;
  kerja_sama: number;
  sikap: number;
  inisiatif: number;
  tanggung_jawab: number;
  komunikasi: number;
  kebersihan: number;
  penampilan: number;
  kecakapan: number;
}

export interface UpdatePenilaianInput {
  kkl_agt_id?: number;
  instansi_penilai_id?: number;
  lama_praktek?: number;
  kehadiran?: number;
  disiplin?: number;
  kejujuran?: number;
  kerajinan?: number;
  kerja_sama?: number;
  sikap?: number;
  inisiatif?: number;
  tanggung_jawab?: number;
  komunikasi?: number;
  kebersihan?: number;
  penampilan?: number;
  kecakapan?: number;
}

export interface PenilaianFormData {
  kkl_agt_id: string;
  instansi_penilai_id: string;
  lama_praktek: string;
  kehadiran: string;
  disiplin: string;
  kejujuran: string;
  kerajinan: string;
  kerja_sama: string;
  sikap: string;
  inisiatif: string;
  tanggung_jawab: string;
  komunikasi: string;
  kebersihan: string;
  penampilan: string;
  kecakapan: string;
}
