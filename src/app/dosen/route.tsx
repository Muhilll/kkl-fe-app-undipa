import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import AnggotaKelompokPage from "./pages/AnggotaKelompokPage";
import LaporanAnggotaPage from "./pages/LaporanAnggotaPage";

export const dosenAreaRoutes = (
  <>
    <Route
      path="/dosen/anggota-kelompok"
      component={() => (
        <ProtectedPage>
          <AnggotaKelompokPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/dosen/anggota-kelompok/:agtId/laporan"
      component={() => (
        <ProtectedPage>
          <LaporanAnggotaPage />
        </ProtectedPage>
      )}
    />
  </>
);
