import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import DosenPage from "./pages/Index";

export const dosenRoutes = (
  <>
    <Route
      path="/master-data/dosens"
      component={() => (
        <ProtectedPage>
          <DosenPage />
        </ProtectedPage>
      )}
    />
  </>
);
