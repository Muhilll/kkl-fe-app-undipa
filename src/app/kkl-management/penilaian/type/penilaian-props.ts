import type { Penilaian, PenilaianFormData } from "./penilaian";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";
import type { InstansiPenilai } from "../../instansi-penilai/type/instansi-penilai";
import type { Instansi } from "../../instansi/type/instansi";
import type { KklKlp } from "../../kkl-klp/type/kkl-klp";

export interface PenilaianFormProps {
  initialData?: Penilaian;
  defaultKklAgtId?: number;
  defaultInstansiPenilaiId?: number;
  readOnly?: boolean;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  agts: KklAgt[];
  penilais: InstansiPenilai[];
  instansis: Instansi[];
  klps: KklKlp[];
  periodes: any[];
}

export interface PenilaianTableProps {
  penilaians: Penilaian[];
  agts: KklAgt[];
  penilais: InstansiPenilai[];
  onEdit: (penilaian: Penilaian) => void;
  onDelete: (id: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
  isLoading: boolean;
}
