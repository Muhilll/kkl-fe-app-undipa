import { questionnaireAPI } from "../../surveys/questionnaire/service/questionnaire.api";
import { submissionsAPI } from "../../surveys/submissions/service/submissions.api";
import { mahasiswaAPI } from "../../master-data/mahasiswa/service/mahasiswa.api";
import type { SusAnswerPayload } from "../type/sus";

export const susAPI = {
  getQuestionnaires: () => questionnaireAPI.getAll(),
  getQuestions: (questionnaireId: number | string) =>
    questionnaireAPI.getQuestions(questionnaireId),
  getStudentSubmissions: (
    questionnaireId: number | string,
    mahasiswaId: number | string,
  ) => questionnaireAPI.getMahasiswaSubmissions(questionnaireId, mahasiswaId),
  submitBatch: (mahasiswaId: number, answers: SusAnswerPayload[]) =>
    submissionsAPI.createBatch({
      mahasiswa_id: mahasiswaId,
      answers,
    }),
  resetStudentSubmissions: (
    questionnaireId: number | string,
    mahasiswaId: number | string,
  ) => questionnaireAPI.deleteMahasiswaSubmissions(questionnaireId, mahasiswaId),
  getAllMahasiswas: () => mahasiswaAPI.getAll(),
};
