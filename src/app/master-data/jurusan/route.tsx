import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import JurusanPage from "./pages/Index";

export const jurusanRoutes = (
  <>
    <Route
      path="/master-data/jurusans"
      component={() => (
        <ProtectedPage>
          <JurusanPage />
        </ProtectedPage>
      )}
    />
  </>
);
