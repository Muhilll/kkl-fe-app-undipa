import { Component, For, Show } from "solid-js";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useSusKklApp } from "../hook/useSusKklApp";
import CompletedView from "./CompletedView";
import QuestionnaireFormView from "./QuestionnaireFormView";

const SusKklAppPage: Component = () => {
  const sus = useSusKklApp();

  return (
    <div class="user-page">
      <Toast toast={sus.toast()} onClose={sus.clearToast} />

      <PageHeader
        title="Evaluasi Usability KKL APP"
        description="Survei evaluasi kemudahan dan kenyamanan penggunaan (Usability) sistem aplikasi KKL."
      />

      {/* Questionnaire switcher if multiple exist */}
      <Show when={sus.questionnaires().length > 1}>
        <div
          class="active-periode-panel"
          style={{ "margin-bottom": "24px" }}
        >
          <div class="active-periode-summary">
            <span class="active-periode-label">Kuesioner Aktif</span>
            <strong style={{ "font-size": "14px" }}>
              {sus.selectedQuestionnaire()?.name || "Pilih Kuesioner"}
            </strong>
          </div>
          <div class="active-periode-control">
            <select
              class="form-select"
              value={sus.selectedQuestionnaireId()}
              onChange={(e) =>
                sus.setSelectedQuestionnaireId(e.currentTarget.value)
              }
            >
              <For each={sus.questionnaires()}>
                {(q) => <option value={q.id}>{q.name}</option>}
              </For>
            </select>
          </div>
        </div>
      </Show>

      <Show when={sus.error()}>
        <div class="error-message" style={{ "margin-bottom": "20px" }}>
          {sus.error()}
        </div>
      </Show>

      {/* Loading state */}
      <Show when={sus.isLoading()}>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            "justify-content": "center",
            padding: "60px 20px",
            color: "var(--gray-500)",
            gap: "12px",
          }}
        >
          <div class="loading-spinner" />
          <span style={{ "font-size": "14px", "font-weight": "500" }}>
            Memeriksa status evaluasi kuesioner Anda...
          </span>
        </div>
      </Show>

      {/* Main Content */}
      <Show when={!sus.isLoading()}>
        <Show
          when={sus.activeMahasiswa()}
          fallback={
            <div
              style={{
                background: "#ffffff",
                border: "1px solid var(--gray-200)",
                "border-radius": "14px",
                padding: "48px 24px",
                "text-align": "center",
                color: "var(--gray-500)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  "font-size": "16px",
                  "font-weight": "600",
                  color: "var(--gray-800)",
                }}
              >
                Akses Khusus Mahasiswa Peserta KKL
              </p>
              <p style={{ margin: 0, "font-size": "14px" }}>
                Menu evaluasi usability ini diperuntukkan bagi mahasiswa yang terdaftar
                dalam program KKL. Akun Anda saat ini tidak terhubung dengan data mahasiswa peserta KKL.
              </p>
            </div>
          }
        >
          <Show
            when={sus.hasSubmitted()}
            fallback={
              <Show
                when={sus.questions().length > 0}
                fallback={
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid var(--gray-200)",
                      "border-radius": "14px",
                      padding: "48px 24px",
                      "text-align": "center",
                      color: "var(--gray-500)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        "font-size": "16px",
                        "font-weight": "600",
                      }}
                    >
                      Belum Ada Pertanyaan pada Kuesioner Ini
                    </p>
                    <p style={{ margin: 0, "font-size": "14px" }}>
                      Administrator belum menambahkan butir pertanyaan evaluasi pada
                      kuesioner terpilih.
                    </p>
                  </div>
                }
              >
                <QuestionnaireFormView
                  questionnaire={sus.selectedQuestionnaire()}
                  questions={sus.questions()}
                  mahasiswa={sus.activeMahasiswa()}
                  userAnswers={sus.userAnswers()}
                  onSelectAnswer={sus.handleSelectAnswer}
                  onSubmit={sus.handleSubmitEvaluation}
                  answeredCount={sus.answeredCount()}
                  totalQuestionsCount={sus.totalQuestionsCount()}
                  progressPercentage={sus.progressPercentage()}
                  isAllAnswered={sus.isAllAnswered()}
                  isSubmitting={sus.isSubmitting()}
                />
              </Show>
            }
          >
            <CompletedView
              mahasiswa={sus.activeMahasiswa()}
              questionnaireName={
                sus.selectedQuestionnaire()?.name || "Kuesioner Evaluasi Usability"
              }
              submissions={sus.submissions()}
              susScoreData={sus.susScoreData()}
              onReset={sus.handleResetEvaluation}
              isSubmitting={sus.isSubmitting()}
            />
          </Show>
        </Show>
      </Show>
    </div>
  );
};

export default SusKklAppPage;
