import type { Instansi, InstansiFormData } from "./instansi";

export interface InstansiTableProps {
  instansis: Instansi[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (instansi: Instansi) => void;
  onDelete: (id: string) => void;
  onManagePenilai?: (id: number) => void;
}

export interface InstansiFormProps {
  initialData?: Instansi;
  onSubmit: (data: InstansiFormData) => void;
  isLoading?: boolean;
}
