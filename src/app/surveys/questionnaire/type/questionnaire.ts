export interface Questionnaire {
  id: number;
  name: string;
  desc: string;
  created_at: string;
  updated_at: string;
  total_questions?: number;
  total_respondents?: number;
}

export interface CreateQuestionnaireInput {
  name: string;
  desc: string;
}

export interface UpdateQuestionnaireInput {
  name?: string;
  desc?: string;
}

export interface QuestionnaireRespondent {
  mahasiswa_id: number;
  nim: string;
  nama: string;
  email: string;
  telp: string | null;
  foto: string | null;
  jurusan_nama: string | null;
  total_answered: number;
  total_score: number;
  average_score: number;
  last_submitted_at: string | null;
}

export interface MahasiswaQuestionnaireAnswer {
  id: number;
  question_id: number;
  question: string;
  options_one: string;
  options_two: string;
  options_three: string;
  options_four: string;
  options_five: string;
  max_score: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionnaireTableProps {
  questionnaires: Questionnaire[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (questionnaire: Questionnaire) => void;
  onDelete: (id: string) => void;
  onManageQuestions: (questionnaire: Questionnaire) => void;
  onManageSubmissions: (questionnaire: Questionnaire) => void;
}
