export interface Dosen {
  id: number;
  nidn: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  image_public_id: string | null;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDosenInput {
  nidn: string;
  nama: string;
  password: string;
  email: string;
  telp?: string | null;
  foto?: string | null;
  image_public_id?: string | null;
}

export interface UpdateDosenInput {
  nidn?: string;
  nama?: string;
  password?: string;
  email?: string;
  telp?: string | null;
  foto?: string | null;
  image_public_id?: string | null;
}

export interface DosenFormData {
  nidn: string;
  nama: string;
  password: string;
  email: string;
  telp: string;
  foto: string;
  image_public_id: string;
}
