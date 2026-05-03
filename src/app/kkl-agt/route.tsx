import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import KklAgtPage from "./pages/Index";

export const kklAgtRoutes = (
  <>
    <Route
      path="/kkl-agts"
      component={() => (
        <ProtectedPage>
          <KklAgtPage />
        </ProtectedPage>
      )}
    />
  </>
);
