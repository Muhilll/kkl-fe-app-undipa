import type { KklPeriode, KklPeriodeFormData } from "./kkl-periode";

export interface KklPeriodeTableProps {
  periodes: KklPeriode[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (periode: KklPeriode) => void;
  onDelete: (id: string) => void;
}

export interface KklPeriodeFormProps {
  initialData?: KklPeriode;
  onSubmit: (data: KklPeriodeFormData) => void;
  isLoading?: boolean;
}
