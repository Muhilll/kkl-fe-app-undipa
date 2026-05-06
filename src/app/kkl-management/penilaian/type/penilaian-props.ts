import type { Penilaian, PenilaianFormData } from "./penilaian";
import type { KklAgt } from "../../kkl-agt/type/kkl-agt";
import type { PembimbingLapangan } from "../../pembimbing-lapangan/type/pembimbing-lapangan";
import type { Instansi } from "../../instansi/type/instansi";
import type { KklKlp } from "../../kkl-klp/type/kkl-klp";

export interface PenilaianFormProps {
  initialData?: Penilaian;
  defaultKklAgtId?: number;
  defaultPembimbingId?: number;
  readOnly?: boolean;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  agts: KklAgt[];
  penilais: PembimbingLapangan[];
  instansis: Instansi[];
  klps: KklKlp[];
  periodes: any[];
}

export interface PenilaianTableProps {
  penilaians: Penilaian[];
  agts: KklAgt[];
  penilais: PembimbingLapangan[];
  onEdit: (penilaian: Penilaian) => void;
  onDelete: (id: string) => void;
  canUpdate: boolean;
  canDelete: boolean;
  isLoading: boolean;
}
