export interface Instansi {
  id: number;
  kode: string;
  nama: string;
  alamat: string;
  telp: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateInstansiInput {
  kode: string;
  nama: string;
  alamat: string;
  telp?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface UpdateInstansiInput {
  kode?: string;
  nama?: string;
  alamat?: string;
  telp?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface InstansiFormData {
  kode: string;
  nama: string;
  alamat: string;
  telp: string;
  latitude: string;
  longitude: string;
}
