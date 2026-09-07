import { Component, createEffect, createSignal } from "solid-js";
import type {
  CreateQuestionnaireInput,
  Questionnaire,
  UpdateQuestionnaireInput,
} from "../type/questionnaire";

interface QuestionnaireFormProps {
  initialData?: Questionnaire;
  onSubmit: (data: CreateQuestionnaireInput | UpdateQuestionnaireInput) => void;
  isLoading: boolean;
}

const QuestionnaireForm: Component<QuestionnaireFormProps> = (props) => {
  const [name, setName] = createSignal("");
  const [desc, setDesc] = createSignal("");

  createEffect(() => {
    if (props.initialData) {
      setName(props.initialData.name);
      setDesc(props.initialData.desc);
    } else {
      setName("");
      setDesc("");
    }
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      name: name(),
      desc: desc(),
    });
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="name">
          Nama Kuesioner <span class="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Contoh: Kuesioner Kepuasan Mahasiswa KKL 2026"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="desc">
          Deskripsi Kuesioner <span class="required">*</span>
        </label>
        <textarea
          id="desc"
          class="form-textarea"
          rows={4}
          value={desc()}
          onInput={(e) => setDesc(e.currentTarget.value)}
          placeholder="Deskripsi tujuan survei atau petunjuk pengisian bagi responden..."
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
            ? "Perbarui Kuesioner"
            : "Simpan Kuesioner"}
      </button>
    </form>
  );
};

export default QuestionnaireForm;
