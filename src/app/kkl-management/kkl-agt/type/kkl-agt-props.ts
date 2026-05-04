import type { KklAgt, KklAgtFormData } from "./kkl-agt";

export interface KklAgtTableProps {
  agts: KklAgt[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (agt: KklAgt) => void;
  onDelete: (id: string) => void;
}

export interface KklAgtFormProps {
  initialData?: KklAgt;
  agts: KklAgt[];
  klps: any[];
  mahasiswas: any[];
  instansis: any[];
  periodes: any[];
  onSubmit: (data: KklAgtFormData) => void;
  isLoading?: boolean;
}
