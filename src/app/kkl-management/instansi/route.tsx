import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import InstansiPage from "./pages/Index";
import ManagePembimbingLapanganPage from "./pages/ManagePembimbingLapanganPage";

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
      path="/kkl-management/instansis/:id/pembimbing-lapangans"
      component={() => (
        <ProtectedPage>
          <ManagePembimbingLapanganPage />
        </ProtectedPage>
      )}
    />
  </>
);
