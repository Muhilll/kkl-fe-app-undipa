export interface KklKlp {
  id: number;
  nama: string;
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
  kkl_periode?: { id: number; nama: string; tahun: string; semester?: string };
  instansi?: { id: number; nama: string };
  dosen?: { id: number; nama: string; nidn: string };
  created_at?: string;
  updated_at?: string;
}

export interface CreateKklKlpInput {
  nama: string;
  kkl_periode_id: number;
  instansi_id: number;
  dosen_id: number;
}

export interface UpdateKklKlpInput {
  nama?: string;
  kkl_periode_id?: number;
  instansi_id?: number;
  dosen_id?: number;
}

export interface KklKlpFormData {
  nama: string;
  kkl_periode_id: string;
  instansi_id: string;
  dosen_id: string;
}
