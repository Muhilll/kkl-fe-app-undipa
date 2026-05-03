import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import KklPeriodePage from "./pages/Index";

export const kklPeriodeRoutes = (
  <>
    <Route
      path="/master-data/kkl-periodes"
      component={() => (
        <ProtectedPage>
          <KklPeriodePage />
        </ProtectedPage>
      )}
    />
  </>
);
