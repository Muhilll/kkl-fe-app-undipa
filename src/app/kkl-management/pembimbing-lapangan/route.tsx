import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import PembimbingLapanganPage from "./pages/Index";

export const pembimbingLapanganRoutes = (
  <Route
    path="/kkl-management/pembimbing-lapangans"
    component={() => (
      <ProtectedPage>
        <PembimbingLapanganPage />
      </ProtectedPage>
    )}
  />
);
