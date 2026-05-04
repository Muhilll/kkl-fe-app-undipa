import type { KklKlp, KklKlpFormData } from "./kkl-klp";

export interface KklKlpTableProps {
  klps: KklKlp[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (klp: KklKlp) => void;
  onDelete: (id: string) => void;
  onManageAnggota: (klp: KklKlp) => void;
}

export interface KklKlpFormProps {
  initialData?: KklKlp;
  klps: any[];
  periodes: any[];
  instansis: any[];
  dosens: any[];
  onSubmit: (data: KklKlpFormData) => void;
  isLoading?: boolean;
}
