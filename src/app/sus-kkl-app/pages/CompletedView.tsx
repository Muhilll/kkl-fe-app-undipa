import { Component, For, Show } from "solid-js";
import { printTableToPdf } from "../../../utils/printTableToPdf";
import type { MahasiswaQuestionnaireAnswer } from "../../surveys/questionnaire/type/questionnaire";
import type { Mahasiswa } from "../../master-data/mahasiswa/type/mahasiswa";
import type { SusScoreCalculation } from "../type/sus";

interface CompletedViewProps {
  mahasiswa: Mahasiswa | null;
  questionnaireName: string;
  submissions: MahasiswaQuestionnaireAnswer[];
  susScoreData: SusScoreCalculation | null;
  onReset: () => void;
  isSubmitting: boolean;
}

const IconCheckCircle = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--emerald-600, #059669)"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconPrinter = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const IconRefresh = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const CompletedView: Component<CompletedViewProps> = (props) => {
  const getOptionLabel = (ans: MahasiswaQuestionnaireAnswer, score: number) => {
    switch (score) {
      case 1:
        return `1 - ${ans.options_one}`;
      case 2:
        return `2 - ${ans.options_two}`;
      case 3:
        return `3 - ${ans.options_three}`;
      case 4:
        return `4 - ${ans.options_four}`;
      case 5:
        return `5 - ${ans.options_five}`;
      default:
        return `Skor ${score}`;
    }
  };

  const handlePrintPdf = () => {
    const m = props.mahasiswa;
    printTableToPdf({
      title: `Hasil Evaluasi Usability KKL APP - ${m?.nama || "Mahasiswa"}`,
      subtitle: `Kuesioner: ${props.questionnaireName} | NIM: ${m?.nim || "-"} | Skor SUS: ${props.susScoreData?.susScore ?? "-"}`,
      headers: ["No", "Butir Pertanyaan", "Jawaban Terpilih", "Skor"],
      rows: props.submissions.map((s, i) => [
        String(i + 1),
        s.question,
        getOptionLabel(s, s.score),
        `${s.score} Poin`,
      ]),
    });
  };

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "24px" }}>
      {/* Success banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
          border: "1px solid #a7f3d0",
          "border-radius": "16px",
          padding: "32px 28px",
          display: "flex",
          "align-items": "center",
          gap: "24px",
          "box-shadow": "0 4px 12px rgba(16, 185, 129, 0.08)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            "border-radius": "50%",
            background: "#d1fae5",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "flex-shrink": 0,
          }}
        >
          <IconCheckCircle />
        </div>
        <div style={{ flex: "1" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              "background-color": "#059669",
              color: "#ffffff",
              "font-size": "11px",
              "font-weight": "800",
              "letter-spacing": "0.08em",
              "text-transform": "uppercase",
              "border-radius": "999px",
              "margin-bottom": "8px",
            }}
          >
            Sudah Mengisi Kuesioner
          </span>
          <h2
            style={{
              margin: "0 0 6px 0",
              "font-size": "22px",
              color: "#065f46",
              "font-weight": "700",
            }}
          >
            Terima Kasih! Evaluasi Usability Anda Telah Terkirim
          </h2>
          <p
            style={{
              margin: 0,
              color: "#047857",
              "font-size": "14px",
              "line-height": "1.5",
            }}
          >
            Anda telah berhasil menyelesaikan pengisian kuesioner{" "}
            <strong>{props.questionnaireName}</strong>. Data jawaban Anda telah
            terekam di sistem untuk keperluan evaluasi usabilitas aplikasi KKL.
          </p>
        </div>
      </div>

      {/* Grid: Responden Info & SUS Score Metric */}
      <div
        style={{
          display: "grid",
          "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Responden details */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid var(--gray-200)",
            "border-radius": "12px",
            padding: "24px",
            "box-shadow": "var(--shadow-sm)",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              "font-size": "16px",
              color: "var(--gray-900)",
              "font-weight": "700",
              "border-bottom": "1px solid var(--gray-100)",
              "padding-bottom": "10px",
            }}
          >
            Rincian Responden
          </h3>
          <div
            style={{
              display: "flex",
              "flex-direction": "column",
              gap: "12px",
              "font-size": "14px",
            }}
          >
            <div style={{ display: "flex", "justify-content": "space-between" }}>
              <span style={{ color: "var(--gray-500)" }}>Nama:</span>
              <strong style={{ color: "var(--gray-900)" }}>
                {props.mahasiswa?.nama || "-"}
              </strong>
            </div>
            <div style={{ display: "flex", "justify-content": "space-between" }}>
              <span style={{ color: "var(--gray-500)" }}>NIM:</span>
              <span style={{ "font-family": "monospace", "font-weight": "600" }}>
                {props.mahasiswa?.nim || "-"}
              </span>
            </div>
            <div style={{ display: "flex", "justify-content": "space-between" }}>
              <span style={{ color: "var(--gray-500)" }}>Pertanyaan Dijawab:</span>
              <strong style={{ color: "var(--brand-800)" }}>
                {props.submissions.length} Butir Soal
              </strong>
            </div>
            <div style={{ display: "flex", "justify-content": "space-between" }}>
              <span style={{ color: "var(--gray-500)" }}>Waktu Pengisian:</span>
              <span style={{ color: "var(--gray-700)", "font-size": "13px" }}>
                {props.submissions[0]?.created_at
                  ? new Date(props.submissions[0].created_at).toLocaleString("id-ID")
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* SUS Score Card */}
        <Show when={props.susScoreData}>
          {(score) => (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--gray-200)",
                "border-radius": "12px",
                padding: "24px",
                "box-shadow": "var(--shadow-sm)",
                display: "flex",
                "flex-direction": "column",
                "justify-content": "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "space-between",
                  "margin-bottom": "14px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    "font-size": "16px",
                    color: "var(--gray-900)",
                    "font-weight": "700",
                  }}
                >
                  System Usability Scale (SUS) Score
                </h3>
                <span
                  style={{
                    padding: "3px 10px",
                    "border-radius": "999px",
                    "font-size": "12px",
                    "font-weight": "700",
                    background:
                      score().susScore >= 68 ? "#ecfdf5" : "#fef3c7",
                    color:
                      score().susScore >= 68 ? "#047857" : "#b45309",
                  }}
                >
                  Grade: {score().grade}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  "align-items": "baseline",
                  gap: "10px",
                  "margin-bottom": "10px",
                }}
              >
                <span
                  style={{
                    "font-size": "42px",
                    "font-weight": "900",
                    color: "var(--brand-800)",
                    "line-height": "1",
                  }}
                >
                  {score().susScore}
                </span>
                <span style={{ color: "var(--gray-500)", "font-size": "15px" }}>
                  / 100 Poin
                </span>
              </div>

              <div style={{ "font-size": "13px", color: "var(--gray-600)" }}>
                <div>
                  <strong>Predikat:</strong> {score().adjectiveRating}
                </div>
                <div>
                  <strong>Kelayakan:</strong> {score().acceptability}
                </div>
              </div>
            </div>
          )}
        </Show>
      </div>

      {/* Answers summary table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--gray-200)",
          "border-radius": "12px",
          padding: "24px",
          "box-shadow": "var(--shadow-sm)",
        }}
      >
        <div
          style={{
            display: "flex",
            "align-items": "center",
            "justify-content": "space-between",
            "margin-bottom": "16px",
            "flex-wrap": "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 4px 0",
                "font-size": "16px",
                color: "var(--gray-900)",
                "font-weight": "700",
              }}
            >
              Daftar Jawaban yang Anda Kirimkan
            </h3>
            <p style={{ margin: 0, "font-size": "13px", color: "var(--gray-500)" }}>
              Rincian jawaban setiap butir pertanyaan yang telah Anda evaluasi.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              class="btn-secondary"
              onClick={handlePrintPdf}
              type="button"
              style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
            >
              <IconPrinter />
              Cetak Bukti (PDF)
            </button>
            <button
              class="btn-secondary"
              onClick={props.onReset}
              disabled={props.isSubmitting}
              type="button"
              style={{ display: "inline-flex", "align-items": "center", gap: "6px" }}
              title="Reset dan isi ulang jika ingin merevisi jawaban Anda"
            >
              <IconRefresh />
              {props.isSubmitting ? "Mereset..." : "Isi Ulang Kuesioner"}
            </button>
          </div>
        </div>

        <div style={{ "overflow-x": "auto" }}>
          <table
            class="app-table"
            style={{
              width: "100%",
              "border-collapse": "collapse",
              "font-size": "13.5px",
            }}
          >
            <thead>
              <tr style={{ background: "var(--gray-50)", "border-bottom": "1px solid var(--gray-200)" }}>
                <th style={{ padding: "12px 16px", "text-align": "left", width: "50px" }}>No</th>
                <th style={{ padding: "12px 16px", "text-align": "left" }}>Butir Pertanyaan</th>
                <th style={{ padding: "12px 16px", "text-align": "left", width: "240px" }}>Pilihan Respon</th>
                <th style={{ padding: "12px 16px", "text-align": "center", width: "80px" }}>Skor</th>
              </tr>
            </thead>
            <tbody>
              <For each={props.submissions}>
                {(sub, index) => (
                  <tr
                    style={{
                      "border-bottom": "1px solid var(--gray-100)",
                      background: index() % 2 === 0 ? "#ffffff" : "var(--gray-50)",
                    }}
                  >
                    <td style={{ padding: "12px 16px", "font-weight": "600", color: "var(--gray-500)" }}>
                      {index() + 1}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--gray-800)", "font-weight": "500" }}>
                      {sub.question}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          "background-color": "var(--emerald-50, #ecfdf5)",
                          color: "var(--emerald-700, #047857)",
                          "border-radius": "8px",
                          "font-weight": "600",
                          "font-size": "12.5px",
                        }}
                      >
                        {getOptionLabel(sub, sub.score)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", "text-align": "center", "font-weight": "700" }}>
                      {sub.score}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedView;
