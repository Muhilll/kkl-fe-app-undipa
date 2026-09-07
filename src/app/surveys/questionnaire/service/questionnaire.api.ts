import { api } from "../../../../services/api";
import type {
  CreateQuestionnaireInput,
  MahasiswaQuestionnaireAnswer,
  Questionnaire,
  QuestionnaireRespondent,
  UpdateQuestionnaireInput,
} from "../type/questionnaire";
import type { Question } from "../../questions/type/questions";

export const questionnaireAPI = {
  getAll: () => api.get<Questionnaire[]>("/surveys/questionnaire"),
  getById: (id: string | number) =>
    api.get<Questionnaire>(`/surveys/questionnaire/${id}`),
  create: (data: CreateQuestionnaireInput) =>
    api.post<any>("/surveys/questionnaire", data),
  update: (id: string | number, data: UpdateQuestionnaireInput) =>
    api.put<any>(`/surveys/questionnaire/${id}`, data),
  delete: (id: string | number) =>
    api.delete<any>(`/surveys/questionnaire/${id}`),
  getQuestions: (id: string | number) =>
    api.get<Question[]>(`/surveys/questionnaire/${id}/questions`),
  getMahasiswas: (id: string | number) =>
    api.get<QuestionnaireRespondent[]>(`/surveys/questionnaire/${id}/mahasiswas`),
  getMahasiswaSubmissions: (
    id: string | number,
    mahasiswaId: string | number,
  ) =>
    api.get<MahasiswaQuestionnaireAnswer[]>(
      `/surveys/questionnaire/${id}/mahasiswas/${mahasiswaId}/submissions`,
    ),
  deleteMahasiswaSubmissions: (
    id: string | number,
    mahasiswaId: string | number,
  ) =>
    api.delete<any>(
      `/surveys/questionnaire/${id}/mahasiswas/${mahasiswaId}/submissions`,
    ),
};
