import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import MenuPage from "./pages/Index";

export const menuRoutes = (
  <>
    <Route
      path="/web-management/menus"
      component={() => (
        <ProtectedPage>
          <MenuPage />
        </ProtectedPage>
      )}
    />
  </>
);
