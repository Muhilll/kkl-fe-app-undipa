import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import QuestionnairePage from "./questionnaire/pages/Index";
import QuestionnaireQuestionsPage from "./questionnaire/pages/QuestionnaireQuestionsPage";
import QuestionSubmissionsPage from "./questionnaire/pages/QuestionSubmissionsPage";
import QuestionnaireMahasiswasPage from "./questionnaire/pages/QuestionnaireMahasiswasPage";
import MahasiswaSubmissionsPage from "./questionnaire/pages/MahasiswaSubmissionsPage";
import QuestionsGeneralPage from "./questions/pages/Index";
import SubmissionsGeneralPage from "./submissions/pages/Index";

export const surveyRoutes = (
  <>
    {/* Questionnaire and nested pages */}
    <Route
      path="/surveys/questionnaire"
      component={() => (
        <ProtectedPage>
          <QuestionnairePage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/surveys/questionnaire/:id/questions"
      component={() => (
        <ProtectedPage>
          <QuestionnaireQuestionsPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/surveys/questionnaire/:id/questions/:questionId/submissions"
      component={() => (
        <ProtectedPage>
          <QuestionSubmissionsPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/surveys/questionnaire/:id/mahasiswas"
      component={() => (
        <ProtectedPage>
          <QuestionnaireMahasiswasPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/surveys/questionnaire/:id/mahasiswas/:mahasiswaId/submissions"
      component={() => (
        <ProtectedPage>
          <MahasiswaSubmissionsPage />
        </ProtectedPage>
      )}
    />

    {/* General Questions page */}
    <Route
      path="/surveys/questions"
      component={() => (
        <ProtectedPage>
          <QuestionsGeneralPage />
        </ProtectedPage>
      )}
    />

    {/* General Submissions page */}
    <Route
      path="/surveys/submissions"
      component={() => (
        <ProtectedPage>
          <SubmissionsGeneralPage />
        </ProtectedPage>
      )}
    />
  </>
);
