export interface KklAgt {
  id: number;
  kkl_klp_id: number;
  mahasiswa_id: number;
  mahasiswa?: { id: number; nama: string; nim: string };
  kkl_klp?: {
    id: number;
    nama?: string;
    kkl_periode?: { id: number; nama: string; tahun: string; semester: string };
    instansi?: { id: number; nama: string; latitude?: number; longitude?: number; alamat?: string; telp?: string };
    dosen?: { id: number; nidn: string; nama: string };
  };
  created_at?: string;
  updated_at?: string;
}

export interface CreateKklAgtInput {
  kkl_klp_id: number;
  mahasiswa_id: number;
}

export interface UpdateKklAgtInput {
  kkl_klp_id?: number;
  mahasiswa_id?: number;
}

export interface KklAgtFormData {
  kkl_klp_id: string;
  mahasiswa_id: string;
}
