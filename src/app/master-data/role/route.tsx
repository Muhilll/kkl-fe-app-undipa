import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import RolePage from "./pages/Index";

export const roleRoutes = (
  <>
    <Route
      path="/master-data/roles"
      component={() => (
        <ProtectedPage>
          <RolePage />
        </ProtectedPage>
      )}
    />
  </>
);
