import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import LaporanPage from "./pages/Index";

export const laporanRoutes = (
  <>
    <Route
      path="/kkl-management/laporans"
      component={() => (
        <ProtectedPage>
          <LaporanPage />
        </ProtectedPage>
      )}
    />
  </>
);
