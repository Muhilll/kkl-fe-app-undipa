import type { Mahasiswa, MahasiswaFormData } from "./mahasiswa";

export interface MahasiswaTableProps {
  mahasiswas: Mahasiswa[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (mahasiswa: Mahasiswa) => void;
  onDelete: (id: string) => void;
}

export interface MahasiswaFormProps {
  initialData?: Mahasiswa;
  onSubmit: (data: MahasiswaFormData) => void;
  isLoading?: boolean;
}
