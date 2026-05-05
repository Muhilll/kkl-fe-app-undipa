import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import InstansiListPage from "./pages/Index";

export const publicInstansiRoutes = (
  <Route
    path="/instansi"
    component={() => (
      <ProtectedPage>
        <InstansiListPage />
      </ProtectedPage>
    )}
  />
);
