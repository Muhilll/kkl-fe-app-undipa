export interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  email: string;
  telp: string;
  foto?: string;
  image_public_id?: string;
  jurusan_id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  jurusan?: {
    kode: string;
    nama: string;
  };
}

export interface CreateMahasiswaInput {
  nim: string;
  nama: string;
  password?: string;
  email: string;
  telp: string;
  foto?: string;
  image_public_id?: string;
  jurusan_id: number;
}

export interface UpdateMahasiswaInput {
  nim?: string;
  nama?: string;
  password?: string;
  email?: string;
  telp?: string;
  foto?: string;
  image_public_id?: string;
  jurusan_id?: number;
}

export interface MahasiswaFormData {
  nim: string;
  nama: string;
  password?: string;
  email: string;
  telp: string;
  foto: string;
  image_public_id: string;
  jurusan_id: string;
}
