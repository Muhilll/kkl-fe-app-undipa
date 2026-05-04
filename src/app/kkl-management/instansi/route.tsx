import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import InstansiPage from "./pages/Index";
import ManageInstansiPenilaiPage from "./pages/ManageInstansiPenilaiPage";

export const instansiRoutes = (
  <>
    <Route
      path="/kkl-management/instansis"
      component={() => (
        <ProtectedPage>
          <InstansiPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/kkl-management/instansis/:id/penilais"
      component={() => (
        <ProtectedPage>
          <ManageInstansiPenilaiPage />
        </ProtectedPage>
      )}
    />
  </>
);
