import { Component, For, Show } from "solid-js";
import type { Question } from "../../surveys/questions/type/questions";
import type { Questionnaire } from "../../surveys/questionnaire/type/questionnaire";
import type { Mahasiswa } from "../../master-data/mahasiswa/type/mahasiswa";

interface QuestionnaireFormViewProps {
  questionnaire: Questionnaire | null;
  questions: Question[];
  mahasiswa: Mahasiswa | null;
  userAnswers: Record<number, number>;
  onSelectAnswer: (questionId: number, score: number) => void;
  onSubmit: () => void;
  answeredCount: number;
  totalQuestionsCount: number;
  progressPercentage: number;
  isAllAnswered: boolean;
  isSubmitting: boolean;
}

const IconSend = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const QuestionnaireFormView: Component<QuestionnaireFormViewProps> = (
  props,
) => {
  const getOptionText = (q: Question, score: number) => {
    switch (score) {
      case 1:
        return q.options_one;
      case 2:
        return q.options_two;
      case 3:
        return q.options_three;
      case 4:
        return q.options_four;
      case 5:
        return q.options_five;
      default:
        return `Opsi ${score}`;
    }
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "24px" }}>
      {/* Questionnaire Intro & Likert Guide */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--gray-200)",
          "border-radius": "16px",
          padding: "28px",
          "box-shadow": "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            "align-items": "center",
            gap: "10px",
            "margin-bottom": "8px",
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              "border-radius": "999px",
              background: "var(--amber-100, #fef3c7)",
              color: "var(--amber-800, #92400e)",
              "font-size": "11px",
              "font-weight": "800",
              "letter-spacing": "0.08em",
              "text-transform": "uppercase",
            }}
          >
            Status: Belum Mengisi
          </span>
          <span style={{ color: "var(--gray-400)", "font-size": "13px" }}>•</span>
          <span style={{ color: "var(--gray-600)", "font-size": "13px" }}>
            Responden: <strong>{props.mahasiswa?.nama || "Mahasiswa"}</strong>{" "}
            ({props.mahasiswa?.nim || "-"})
          </span>
        </div>

        <h2
          style={{
            margin: "0 0 10px 0",
            "font-size": "22px",
            color: "var(--gray-900)",
            "font-weight": "800",
          }}
        >
          {props.questionnaire?.name || "Kuesioner Evaluasi Usability"}
        </h2>

        <p
          style={{
            margin: "0 0 18px 0",
            color: "var(--gray-600)",
            "font-size": "14px",
            "line-height": "1.6",
          }}
        >
          {props.questionnaire?.desc ||
            "Silakan berikan penilaian Anda secara objektif terhadap pengalaman penggunaan aplikasi KKL UNDIPA. Penilaian Anda sangat berharga untuk peningkatan kualitas sistem."}
        </p>

        {/* Petunjuk Skala */}
        <div
          style={{
            background: "var(--gray-50)",
            border: "1px solid var(--gray-200)",
            "border-radius": "10px",
            padding: "14px 18px",
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            "flex-wrap": "wrap",
            gap: "10px",
            "font-size": "13px",
          }}
        >
          <span style={{ "font-weight": "700", color: "var(--gray-700)" }}>
            Petunjuk Skala Penilaian:
          </span>
          <div
            style={{
              display: "flex",
              "flex-wrap": "wrap",
              gap: "8px 16px",
              color: "var(--gray-600)",
            }}
          >
            <span>
              <strong>1</strong> = Sangat Tidak Setuju
            </span>
            <span>
              <strong>2</strong> = Tidak Setuju
            </span>
            <span>
              <strong>3</strong> = Netral / Cukup
            </span>
            <span>
              <strong>4</strong> = Setuju
            </span>
            <span>
              <strong>5</strong> = Sangat Setuju
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Progress Bar */}
      <div
        style={{
          position: "sticky",
          top: "70px",
          "z-index": "10",
          background: "rgba(255, 255, 255, 0.95)",
          "backdrop-filter": "blur(8px)",
          border: "1px solid var(--gray-200)",
          "border-radius": "12px",
          padding: "16px 20px",
          "box-shadow": "0 4px 14px rgba(0, 0, 0, 0.06)",
          display: "flex",
          "flex-direction": "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            "font-size": "13px",
          }}
        >
          <span style={{ "font-weight": "700", color: "var(--gray-700)" }}>
            Progress Pengisian Kuesioner
          </span>
          <span
            style={{
              "font-weight": "700",
              color: props.isAllAnswered ? "var(--emerald-600)" : "var(--brand-800)",
            }}
          >
            {props.answeredCount} dari {props.totalQuestionsCount} Soal Dijawab ({props.progressPercentage}%)
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "8px",
            background: "var(--gray-200)",
            "border-radius": "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${props.progressPercentage}%`,
              background: props.isAllAnswered
                ? "var(--emerald-600, #059669)"
                : "var(--brand-800, #b91c1c)",
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Questions list */}
      <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
        <For each={props.questions}>
          {(q, index) => {
            const selectedScore = () => props.userAnswers[q.id];
            const isAnswered = () => selectedScore() !== undefined;

            return (
              <div
                style={{
                  background: "#ffffff",
                  border: isAnswered()
                    ? "1px solid var(--emerald-400, #34d399)"
                    : "1px solid var(--gray-200)",
                  "border-radius": "14px",
                  padding: "20px 24px",
                  "box-shadow": isAnswered()
                    ? "0 2px 8px rgba(16, 185, 129, 0.08)"
                    : "var(--shadow-sm)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              >
                {/* Question title header */}
                <div
                  style={{
                    display: "flex",
                    "align-items": "flex-start",
                    gap: "14px",
                    "margin-bottom": "16px",
                  }}
                >
                  <span
                    style={{
                      width: "32px",
                      height: "32px",
                      "border-radius": "8px",
                      background: isAnswered()
                        ? "var(--emerald-600, #059669)"
                        : "var(--gray-100)",
                      color: isAnswered() ? "#ffffff" : "var(--gray-700)",
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "center",
                      "font-weight": "800",
                      "font-size": "13px",
                      "flex-shrink": 0,
                    }}
                  >
                    #{index() + 1}
                  </span>

                  <div style={{ flex: "1" }}>
                    <p
                      style={{
                        margin: 0,
                        "font-size": "15px",
                        "font-weight": "600",
                        color: "var(--gray-900)",
                        "line-height": "1.5",
                      }}
                    >
                      {q.question}
                    </p>
                  </div>
                </div>

                {/* 5 Options pill grid */}
                <div
                  style={{
                    display: "grid",
                    "grid-template-columns":
                      "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "10px",
                  }}
                >
                  <For each={[1, 2, 3, 4, 5]}>
                    {(scoreVal) => {
                      const isSelected = () => selectedScore() === scoreVal;

                      return (
                        <button
                          type="button"
                          onClick={() => props.onSelectAnswer(q.id, scoreVal)}
                          style={{
                            display: "flex",
                            "flex-direction": "column",
                            "align-items": "center",
                            "justify-content": "center",
                            padding: "12px 10px",
                            "border-radius": "10px",
                            border: isSelected()
                              ? "2px solid var(--emerald-600, #059669)"
                              : "1px solid var(--gray-200)",
                            background: isSelected()
                              ? "var(--emerald-50, #ecfdf5)"
                              : "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "text-align": "center",
                            outline: "none",
                          }}
                        >
                          <span
                            style={{
                              "font-size": "16px",
                              "font-weight": "800",
                              color: isSelected()
                                ? "var(--emerald-700, #047857)"
                                : "var(--gray-700)",
                              "margin-bottom": "4px",
                            }}
                          >
                            {scoreVal}
                          </span>
                          <span
                            style={{
                              "font-size": "11.5px",
                              "font-weight": isSelected() ? "700" : "500",
                              color: isSelected()
                                ? "var(--emerald-700, #047857)"
                                : "var(--gray-500)",
                              "line-height": "1.3",
                            }}
                          >
                            {getOptionText(q, scoreVal)}
                          </span>
                        </button>
                      );
                    }}
                  </For>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      {/* Submission Card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--gray-200)",
          "border-radius": "16px",
          padding: "24px 28px",
          display: "flex",
          "align-items": "center",
          "justify-content": "space-between",
          "flex-wrap": "wrap",
          gap: "16px",
          "box-shadow": "var(--shadow-sm)",
        }}
      >
        <div>
          <h4
            style={{
              margin: "0 0 4px 0",
              "font-size": "15px",
              color: "var(--gray-900)",
              "font-weight": "700",
            }}
          >
            Konfirmasi Pengiriman Jawaban
          </h4>
          <p style={{ margin: 0, "font-size": "13px", color: "var(--gray-500)" }}>
            {props.isAllAnswered
              ? "Semua butir pertanyaan telah terisi. Klik tombol di samping untuk mengirimkan respon Anda."
              : `Masih terdapat ${props.totalQuestionsCount - props.answeredCount} pertanyaan yang belum dijawab.`}
          </p>
        </div>

        <button
          type="button"
          onClick={props.onSubmit}
          disabled={!props.isAllAnswered || props.isSubmitting}
          class="btn-primary"
          style={{
            display: "inline-flex",
            "align-items": "center",
            gap: "8px",
            padding: "12px 24px",
            "font-size": "14px",
            "font-weight": "700",
            "border-radius": "10px",
          }}
        >
          <IconSend />
          {props.isSubmitting
            ? "Mengirimkan Respon..."
            : "Kirim Jawaban Evaluasi"}
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireFormView;
