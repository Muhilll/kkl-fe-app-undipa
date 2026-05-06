import type { PembimbingLapangan, CreatePembimbingLapanganInput, UpdatePembimbingLapanganInput } from "./pembimbing-lapangan";

export interface PembimbingLapanganTableProps {
  pembimbingLapangans: PembimbingLapangan[];
  klps: any[];
  isLoading: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (data: PembimbingLapangan) => void;
  onDelete: (id: string) => void;
}

export interface PembimbingLapanganFormProps {
  initialData?: PembimbingLapangan;
  klps: any[]; // List of KKL Kelompok to choose from
  instansis: any[];
  periodes: any[];
  fixedInstansiId?: number;
  onSubmit: (data: CreatePembimbingLapanganInput | UpdatePembimbingLapanganInput) => void;
  isLoading: boolean;
}
