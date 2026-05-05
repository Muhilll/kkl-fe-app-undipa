import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import MahasiswaPenilaianPage from "./pages/Index";

export const mahasiswaPenilaianRoutes = (
  <Route
    path="/mahasiswa/penilaian"
    component={() => (
      <ProtectedPage>
        <MahasiswaPenilaianPage />
      </ProtectedPage>
    )}
  />
);
