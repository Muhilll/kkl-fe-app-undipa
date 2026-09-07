export interface Submission {
  id: number;
  mahasiswa_id: number;
  question_id: number;
  score: number;
  created_at: string;
  updated_at: string;
  mahasiswa_nim?: string;
  mahasiswa_nama?: string;
  mahasiswa_email?: string;
  jurusan_nama?: string | null;
  question?: string;
  questionnaire_id?: number;
  questionnaire_name?: string | null;
}

export interface CreateSubmissionInput {
  mahasiswa_id: number;
  question_id: number;
  score: number;
}

export interface UpdateSubmissionInput {
  mahasiswa_id?: number;
  question_id?: number;
  score?: number;
}

export interface SubmissionsTableProps {
  submissions: Submission[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (submission: Submission) => void;
  onDelete: (id: string) => void;
  hideMahasiswaCol?: boolean;
  hideQuestionCol?: boolean;
}
