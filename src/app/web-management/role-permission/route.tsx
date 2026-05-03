import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import RolePermissionPage from "./pages/Index";

export const rolePermissionRoutes = (
  <>
    <Route
      path="/web-management/role-permissions"
      component={() => (
        <ProtectedPage>
          <RolePermissionPage />
        </ProtectedPage>
      )}
    />
  </>
);
