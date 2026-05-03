import type { Jurusan, JurusanFormData } from "./jurusan";

export interface JurusanTableProps {
  jurusans: Jurusan[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (jurusan: Jurusan) => void;
  onDelete: (id: string) => void;
}

export interface JurusanFormProps {
  initialData?: Jurusan;
  onSubmit: (data: JurusanFormData) => void;
  isLoading?: boolean;
}
