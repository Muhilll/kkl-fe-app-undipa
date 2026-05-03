import type { Dosen, DosenFormData } from "./dosen";

export interface DosenTableProps {
  dosens: Dosen[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (dosen: Dosen) => void;
  onDelete: (id: string) => void;
}

export interface DosenFormProps {
  initialData?: Dosen;
  onSubmit: (data: DosenFormData) => void;
  isLoading?: boolean;
}
