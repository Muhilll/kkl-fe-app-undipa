import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import KklKlpPage from "./pages/Index";
import ManageAnggotaPage from "./pages/ManageAnggotaPage";
import ManageLaporanAnggotaPage from "./pages/ManageLaporanAnggotaPage";
import ManagePenilaianAnggotaPage from "./pages/ManagePenilaianAnggotaPage";

export const kklKlpRoutes = (
  <>
    <Route
      path="/kkl-klps"
      component={() => (
        <ProtectedPage>
          <KklKlpPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/kkl-klps/:id/anggota"
      component={() => (
        <ProtectedPage>
          <ManageAnggotaPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/kkl-klps/:id/anggota/:agtId/laporan"
      component={() => (
        <ProtectedPage>
          <ManageLaporanAnggotaPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/kkl-klps/:id/anggota/:agtId/penilaian"
      component={() => (
        <ProtectedPage>
          <ManagePenilaianAnggotaPage />
        </ProtectedPage>
      )}
    />
  </>
);
