import { Component, createEffect, createSignal, For } from "solid-js";
import type {
  CreateQuestionInput,
  Question,
  UpdateQuestionInput,
} from "../type/questions";
import type { Questionnaire } from "../../questionnaire/type/questionnaire";

interface QuestionFormProps {
  initialData?: Question;
  questionnaires: Questionnaire[];
  defaultQuestionnaireId?: number;
  onSubmit: (data: CreateQuestionInput | UpdateQuestionInput) => void;
  isLoading: boolean;
}

const QuestionForm: Component<QuestionFormProps> = (props) => {
  const [questionnaireId, setQuestionnaireId] = createSignal("");
  const [questionText, setQuestionText] = createSignal("");
  const [optOne, setOptOne] = createSignal("Sangat Tidak Setuju");
  const [optTwo, setOptTwo] = createSignal("Tidak Setuju");
  const [optThree, setOptThree] = createSignal("Ragu-ragu / Cukup");
  const [optFour, setOptFour] = createSignal("Setuju");
  const [optFive, setOptFive] = createSignal("Sangat Setuju");
  const [score, setScore] = createSignal(5);

  createEffect(() => {
    if (props.initialData) {
      setQuestionnaireId(String(props.initialData.questionnaire_id));
      setQuestionText(props.initialData.question);
      setOptOne(props.initialData.options_one);
      setOptTwo(props.initialData.options_two);
      setOptThree(props.initialData.options_three);
      setOptFour(props.initialData.options_four);
      setOptFive(props.initialData.options_five);
      setScore(props.initialData.score);
    } else {
      setQuestionnaireId(
        props.defaultQuestionnaireId
          ? String(props.defaultQuestionnaireId)
          : props.questionnaires[0]?.id
            ? String(props.questionnaires[0].id)
            : "",
      );
      setQuestionText("");
      setOptOne("Sangat Tidak Setuju");
      setOptTwo("Tidak Setuju");
      setOptThree("Ragu-ragu / Cukup");
      setOptFour("Setuju");
      setOptFive("Sangat Setuju");
      setScore(5);
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      questionnaire_id: Number(questionnaireId()),
      question: questionText(),
      options_one: optOne(),
      options_two: optTwo(),
      options_three: optThree(),
      options_four: optFour(),
      options_five: optFive(),
      score: Number(score()),
    });
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="questionnaireId">
          Kuesioner <span class="required">*</span>
        </label>
        <select
          id="questionnaireId"
          class="form-select"
          value={questionnaireId()}
          onChange={(e) => setQuestionnaireId(e.currentTarget.value)}
          required
          disabled={props.isLoading}
        >
          <option value="">-- Pilih Kuesioner --</option>
          <For each={props.questionnaires}>
            {(q) => <option value={q.id}>{q.name}</option>}
          </For>
        </select>
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="question">
          Butir Pertanyaan <span class="required">*</span>
        </label>
        <textarea
          id="question"
          class="form-textarea"
          rows={3}
          value={questionText()}
          onInput={(e) => setQuestionText(e.currentTarget.value)}
          placeholder="Tuliskan butir pertanyaan survei..."
          required
          disabled={props.isLoading}
        />
      </div>

      <div
        style={{
          "grid-column": "1 / -1",
          display: "flex",
          "flex-direction": "column",
          gap: "12px",
          background: "var(--gray-50)",
          padding: "16px",
          "border-radius": "8px",
          border: "1px solid var(--gray-200)",
        }}
      >
        <span
          style={{
            "font-size": "11px",
            "font-weight": "700",
            "letter-spacing": "0.07em",
            "text-transform": "uppercase",
            color: "var(--gray-500)",
          }}
        >
          Label Opsi Jawaban (Skala 1 - 5)
        </span>

        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <div class="form-group">
            <label for="optOne">Opsi 1 (Skor 1) *</label>
            <input
              id="optOne"
              type="text"
              value={optOne()}
              onInput={(e) => setOptOne(e.currentTarget.value)}
              placeholder="Contoh: Sangat Tidak Setuju"
              required
              disabled={props.isLoading}
            />
          </div>
          <div class="form-group">
            <label for="optTwo">Opsi 2 (Skor 2) *</label>
            <input
              id="optTwo"
              type="text"
              value={optTwo()}
              onInput={(e) => setOptTwo(e.currentTarget.value)}
              placeholder="Contoh: Tidak Setuju"
              required
              disabled={props.isLoading}
            />
          </div>
          <div class="form-group">
            <label for="optThree">Opsi 3 (Skor 3) *</label>
            <input
              id="optThree"
              type="text"
              value={optThree()}
              onInput={(e) => setOptThree(e.currentTarget.value)}
              placeholder="Contoh: Cukup / Netral"
              required
              disabled={props.isLoading}
            />
          </div>
          <div class="form-group">
            <label for="optFour">Opsi 4 (Skor 4) *</label>
            <input
              id="optFour"
              type="text"
              value={optFour()}
              onInput={(e) => setOptFour(e.currentTarget.value)}
              placeholder="Contoh: Setuju"
              required
              disabled={props.isLoading}
            />
          </div>
          <div class="form-group">
            <label for="optFive">Opsi 5 (Skor 5) *</label>
            <input
              id="optFive"
              type="text"
              value={optFive()}
              onInput={(e) => setOptFive(e.currentTarget.value)}
              placeholder="Contoh: Sangat Setuju"
              required
              disabled={props.isLoading}
            />
          </div>
        </div>
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="score">
          Skor Maksimal / Bobot <span class="required">*</span>
        </label>
        <input
          id="score"
          type="number"
          min={1}
          value={score()}
          onInput={(e) => setScore(Number(e.currentTarget.value))}
          required
          disabled={props.isLoading}
        />
      </div>

      <button
        type="submit"
        class="btn-submit"
        disabled={props.isLoading}
      >
        {props.isLoading
          ? "Menyimpan..."
          : props.initialData
            ? "Perbarui Pertanyaan"
            : "Simpan Pertanyaan"}
      </button>
    </form>
  );
};

export default QuestionForm;
