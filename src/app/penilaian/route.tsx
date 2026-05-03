import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import PenilaianPage from "./pages/Index";

export const penilaianRoutes = (
  <>
    <Route
      path="/penilaian"
      component={() => (
        <ProtectedPage>
          <PenilaianPage />
        </ProtectedPage>
      )}
    />
  </>
);
