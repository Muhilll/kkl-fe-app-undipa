import { api } from "../../../../services/api";
import type {
  CreateQuestionInput,
  Question,
  QuestionSubmission,
  UpdateQuestionInput,
} from "../type/questions";

export const questionsAPI = {
  getAll: (questionnaireId?: string | number) => {
    const endpoint = questionnaireId
      ? `/surveys/questions?questionnaire_id=${questionnaireId}`
      : "/surveys/questions";
    return api.get<Question[]>(endpoint);
  },
  getById: (id: string | number) =>
    api.get<Question>(`/surveys/questions/${id}`),
  create: (data: CreateQuestionInput) =>
    api.post<any>("/surveys/questions", data),
  update: (id: string | number, data: UpdateQuestionInput) =>
    api.put<any>(`/surveys/questions/${id}`, data),
  delete: (id: string | number) => api.delete<any>(`/surveys/questions/${id}`),
  getSubmissions: (id: string | number) =>
    api.get<QuestionSubmission[]>(`/surveys/questions/${id}/submissions`),
};
