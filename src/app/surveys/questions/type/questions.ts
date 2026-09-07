export interface Question {
  id: number;
  questionnaire_id: number;
  question: string;
  options_one: string;
  options_two: string;
  options_three: string;
  options_four: string;
  options_five: string;
  score: number;
  created_at: string;
  updated_at: string;
  questionnaire_name?: string | null;
  total_submissions?: number;
}

export interface CreateQuestionInput {
  questionnaire_id: number;
  question: string;
  options_one: string;
  options_two: string;
  options_three: string;
  options_four: string;
  options_five: string;
  score: number;
}

export interface UpdateQuestionInput {
  questionnaire_id?: number;
  question?: string;
  options_one?: string;
  options_two?: string;
  options_three?: string;
  options_four?: string;
  options_five?: string;
  score?: number;
}

export interface QuestionSubmission {
  id: number;
  question_id: number;
  mahasiswa_id: number;
  score: number;
  created_at: string;
  updated_at: string;
  mahasiswa_nim: string;
  mahasiswa_nama: string;
  mahasiswa_email: string;
  jurusan_nama: string | null;
}

export interface QuestionsTableProps {
  questions: Question[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onViewSubmissions?: (question: Question) => void;
  hideQuestionnaireCol?: boolean;
}
