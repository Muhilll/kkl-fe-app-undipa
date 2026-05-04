export type Semester = "ganjil" | "genap";

export interface KklPeriode {
  id: number;
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateKklPeriodeInput {
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  is_active?: boolean;
}

export interface UpdateKklPeriodeInput {
  nama?: string;
  tahun?: string;
  semester?: Semester;
  max_agt_klp?: number;
  is_active?: boolean;
}

export interface KklPeriodeFormData {
  nama: string;
  tahun: string;
  semester: Semester;
  max_agt_klp: number;
  is_active: boolean;
}
