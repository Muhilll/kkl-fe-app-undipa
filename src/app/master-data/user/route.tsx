import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import UserPage from "./pages/Index";

export const userRoutes = (
  <>
    <Route
      path="/master-data/users"
      component={() => (
        <ProtectedPage>
          <UserPage />
        </ProtectedPage>
      )}
    />
  </>
);
