import type { Laporan } from "./laporan";

export interface LaporanTableProps {
  laporans: Laporan[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (laporan: Laporan) => void;
  onDelete: (id: string) => void;
}

export interface LaporanFormProps {
  initialData?: Laporan;
  agts: any[];
  instansis: any[];
  klps: any[];
  periodes: any[];
  defaultKklAgtId?: number;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}
