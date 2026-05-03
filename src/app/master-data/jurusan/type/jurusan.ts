export interface Jurusan {
  id: number;
  kode: string;
  nama: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateJurusanInput {
  kode: string;
  nama: string;
}

export interface UpdateJurusanInput {
  kode?: string;
  nama?: string;
}

export interface JurusanFormData {
  kode: string;
  nama: string;
}
