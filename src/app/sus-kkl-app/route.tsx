import { Route } from "@solidjs/router";
import { lazy } from "solid-js";

const SusKklAppPage = lazy(() => import("./pages/Index"));

export const susKklAppRoutes = (
  <>
    <Route path="/evaluasi-usability-kkl-app" component={SusKklAppPage} />
  </>
);
