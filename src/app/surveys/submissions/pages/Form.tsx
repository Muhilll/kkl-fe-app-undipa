import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
} from "solid-js";
import type {
  CreateSubmissionInput,
  Submission,
  UpdateSubmissionInput,
} from "../type/submissions";
import type { Questionnaire } from "../../questionnaire/type/questionnaire";
import type { Question } from "../../questions/type/questions";

interface SubmissionFormProps {
  initialData?: Submission;
  questionnaires: Questionnaire[];
  questions: Question[];
  mahasiswas: any[];
  onSubmit: (data: CreateSubmissionInput | UpdateSubmissionInput) => void;
  isLoading: boolean;
}

const SubmissionForm: Component<SubmissionFormProps> = (props) => {
  const [mahasiswaId, setMahasiswaId] = createSignal("");
  const [questionnaireId, setQuestionnaireId] = createSignal("");
  const [questionId, setQuestionId] = createSignal("");
  const [score, setScore] = createSignal(5);

  createEffect(() => {
    if (props.initialData) {
      setMahasiswaId(String(props.initialData.mahasiswa_id));
      setQuestionId(String(props.initialData.question_id));
      setScore(props.initialData.score);
      const q = props.questions.find((x) => x.id === props.initialData!.question_id);
      if (q) setQuestionnaireId(String(q.questionnaire_id));
    } else {
      setMahasiswaId("");
      setQuestionnaireId(
        props.questionnaires[0]?.id ? String(props.questionnaires[0].id) : "",
      );
      setQuestionId("");
      setScore(5);
    }
  });

  const filteredQuestions = createMemo(() => {
    const qnId = questionnaireId();
    if (!qnId) return props.questions;
    return props.questions.filter((q) => String(q.questionnaire_id) === qnId);
  });

  const selectedQuestionObj = createMemo(() => {
    const qId = questionId();
    if (!qId) return null;
    return props.questions.find((q) => String(q.id) === qId) || null;
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      mahasiswa_id: Number(mahasiswaId()),
      question_id: Number(questionId()),
      score: Number(score()),
    });
  };

  const getOptionLabel = (scoreValue: number) => {
    const q = selectedQuestionObj();
    if (!q) return `Skor ${scoreValue}`;
    switch (scoreValue) {
      case 1:
        return `1 - ${q.options_one}`;
      case 2:
        return `2 - ${q.options_two}`;
      case 3:
        return `3 - ${q.options_three}`;
      case 4:
        return `4 - ${q.options_four}`;
      case 5:
        return `5 - ${q.options_five}`;
      default:
        return `Skor ${scoreValue}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="mahasiswa">
          Mahasiswa <span class="required">*</span>
        </label>
        <select
          id="mahasiswa"
          class="form-select"
          value={mahasiswaId()}
          onChange={(e) => setMahasiswaId(e.currentTarget.value)}
          disabled={!!props.initialData || props.isLoading}
          required
        >
          <option value="">-- Pilih Mahasiswa --</option>
          <For each={props.mahasiswas}>
            {(m) => (
              <option value={m.id}>
                {m.nama} ({m.nim})
              </option>
            )}
          </For>
        </select>
      </div>

      <Show when={!props.initialData}>
        <div class="form-group" style={{ "grid-column": "1 / -1" }}>
          <label for="qn">Filter Berdasarkan Kuesioner</label>
          <select
            id="qn"
            class="form-select"
            value={questionnaireId()}
            onChange={(e) => {
              setQuestionnaireId(e.currentTarget.value);
              setQuestionId("");
            }}
            disabled={props.isLoading}
          >
            <option value="">-- Semua Kuesioner --</option>
            <For each={props.questionnaires}>
              {(q) => <option value={q.id}>{q.name}</option>}
            </For>
          </select>
        </div>
      </Show>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="question">
          Butir Pertanyaan <span class="required">*</span>
        </label>
        <select
          id="question"
          class="form-select"
          value={questionId()}
          onChange={(e) => setQuestionId(e.currentTarget.value)}
          disabled={!!props.initialData || props.isLoading}
          required
        >
          <option value="">-- Pilih Pertanyaan --</option>
          <For each={filteredQuestions()}>
            {(q) => (
              <option value={q.id}>
                #{q.id} - {q.question.length > 80 ? `${q.question.substring(0, 80)}...` : q.question}
              </option>
            )}
          </For>
        </select>
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="score">
          Pilihan Jawaban / Skor <span class="required">*</span>
        </label>
        <select
          id="score"
          class="form-select"
          value={score()}
          onChange={(e) => setScore(Number(e.currentTarget.value))}
          required
          disabled={props.isLoading}
        >
          <option value={1}>{getOptionLabel(1)}</option>
          <option value={2}>{getOptionLabel(2)}</option>
          <option value={3}>{getOptionLabel(3)}</option>
          <option value={4}>{getOptionLabel(4)}</option>
          <option value={5}>{getOptionLabel(5)}</option>
        </select>
      </div>

      <button
        type="submit"
        class="btn-submit"
        disabled={props.isLoading}
      >
        {props.isLoading
          ? "Menyimpan..."
          : props.initialData
            ? "Perbarui Jawaban"
            : "Simpan Jawaban"}
      </button>
    </form>
  );
};

export default SubmissionForm;
