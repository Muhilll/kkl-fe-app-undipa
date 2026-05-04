import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import PenilaianPage from "./pages/Index";

export const penilaianRoutes = (
  <>
    <Route
      path="/kkl-management/penilaians"
      component={() => (
        <ProtectedPage>
          <PenilaianPage />
        </ProtectedPage>
      )}
    />
  </>
);
