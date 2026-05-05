import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import MahasiswaLaporanPage from "./pages/Index";

export const mahasiswaLaporanRoutes = (
  <Route
    path="/mahasiswa/laporan"
    component={() => (
      <ProtectedPage>
        <MahasiswaLaporanPage />
      </ProtectedPage>
    )}
  />
);
