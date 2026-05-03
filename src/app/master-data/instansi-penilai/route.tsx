import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import InstansiPenilaiPage from "./pages/Index";

export const instansiPenilaiRoutes = (
  <Route
    path="/master-data/instansi-penilais"
    component={() => (
      <ProtectedPage>
        <InstansiPenilaiPage />
      </ProtectedPage>
    )}
  />
);
