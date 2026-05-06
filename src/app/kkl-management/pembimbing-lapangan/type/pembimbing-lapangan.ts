export interface PembimbingLapangan {
  id: number;
  kkl_klp_id: number;
  virtual_account: string;
  password?: string;
  nama: string;
  jabatan: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  kkl_klp?: any; // To hold related KklKlp data if expanded
  user?: any; // To hold related User data
}

export interface CreatePembimbingLapanganInput {
  kkl_klp_id: number | null;
  virtual_account: string;
  password?: string;
  nama: string;
  jabatan: string;
}

export interface UpdatePembimbingLapanganInput {
  kkl_klp_id?: number;
  virtual_account?: string;
  password?: string;
  nama?: string;
  jabatan?: string;
}
