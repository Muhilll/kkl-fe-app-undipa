import type { Question } from "../../surveys/questions/type/questions";
import type { Questionnaire, MahasiswaQuestionnaireAnswer } from "../../surveys/questionnaire/type/questionnaire";
import type { Mahasiswa } from "../../master-data/mahasiswa/type/mahasiswa";

export interface SusAnswerPayload {
  question_id: number;
  score: number;
}

export interface SusScoreCalculation {
  rawScore: number;
  maxRawScore: number;
  susScore: number; // 0 - 100
  grade: string; // e.g. "A+", "A", "B", "C", "D", "F"
  adjectiveRating: string; // "Best Imaginable", "Excellent", "Good", "OK", "Poor", "Worst"
  acceptability: string; // "Acceptable", "Marginal", "Not Acceptable"
}

export interface SusEvaluationState {
  isLoading: boolean;
  isSubmitting: boolean;
  questionnaire: Questionnaire | null;
  mahasiswa: Mahasiswa | null;
  hasSubmitted: boolean;
  questions: Question[];
  submissions: MahasiswaQuestionnaireAnswer[];
  susScoreData: SusScoreCalculation | null;
}
