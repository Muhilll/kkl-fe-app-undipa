import type { InstansiPenilai, CreateInstansiPenilaiInput, UpdateInstansiPenilaiInput } from "./instansi-penilai";

export interface InstansiPenilaiTableProps {
  instansiPenilais: InstansiPenilai[];
  klps: any[];
  isLoading: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (data: InstansiPenilai) => void;
  onDelete: (id: string) => void;
}

export interface InstansiPenilaiFormProps {
  initialData?: InstansiPenilai;
  klps: any[]; // List of KKL Kelompok to choose from
  instansis: any[];
  periodes: any[];
  fixedInstansiId?: number;
  onSubmit: (data: CreateInstansiPenilaiInput | UpdateInstansiPenilaiInput) => void;
  isLoading: boolean;
}
