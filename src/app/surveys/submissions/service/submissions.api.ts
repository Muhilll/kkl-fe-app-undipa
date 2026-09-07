import { api } from "../../../../services/api";
import type {
  CreateSubmissionInput,
  Submission,
  UpdateSubmissionInput,
} from "../type/submissions";

export const submissionsAPI = {
  getAll: (params?: {
    questionnaire_id?: string | number;
    question_id?: string | number;
    mahasiswa_id?: string | number;
  }) => {
    const query = new URLSearchParams();
    if (params?.questionnaire_id)
      query.append("questionnaire_id", String(params.questionnaire_id));
    if (params?.question_id)
      query.append("question_id", String(params.question_id));
    if (params?.mahasiswa_id)
      query.append("mahasiswa_id", String(params.mahasiswa_id));

    const queryString = query.toString();
    const endpoint = queryString
      ? `/surveys/submissions?${queryString}`
      : "/surveys/submissions";
    return api.get<Submission[]>(endpoint);
  },
  getById: (id: string | number) =>
    api.get<Submission>(`/surveys/submissions/${id}`),
  create: (data: CreateSubmissionInput) =>
    api.post<any>("/surveys/submissions", data),
  createBatch: (data: {
    mahasiswa_id: number;
    answers: { question_id: number; score: number }[];
  }) => api.post<any>("/surveys/submissions/batch", data),
  update: (id: string | number, data: UpdateSubmissionInput) =>
    api.put<any>(`/surveys/submissions/${id}`, data),
  delete: (id: string | number) =>
    api.delete<any>(`/surveys/submissions/${id}`),
};
