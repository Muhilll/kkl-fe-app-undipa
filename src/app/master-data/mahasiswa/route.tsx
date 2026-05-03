import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import MahasiswaPage from "./pages/Index";

export const mahasiswaRoutes = (
  <>
    <Route
      path="/master-data/mahasiswas"
      component={() => (
        <ProtectedPage>
          <MahasiswaPage />
        </ProtectedPage>
      )}
    />
  </>
);
