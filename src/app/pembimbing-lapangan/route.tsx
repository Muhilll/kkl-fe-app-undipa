import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import AnggotaKelompokPembimbingPage from "./pages/AnggotaKelompokPage";
import PenilaianAnggotaPembimbingPage from "./pages/PenilaianAnggotaPage";

export const pembimbingLapanganAreaRoutes = (
  <>
    <Route
      path="/pembimbing-lapangan/anggota-kelompok"
      component={() => (
        <ProtectedPage>
          <AnggotaKelompokPembimbingPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/pembimbing-lapangan/anggota-kelompok/:agtId/penilaian"
      component={() => (
        <ProtectedPage>
          <PenilaianAnggotaPembimbingPage />
        </ProtectedPage>
      )}
    />
  </>
);
