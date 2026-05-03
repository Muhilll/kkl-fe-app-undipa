import { Router } from "@solidjs/router";
import type { Component } from "solid-js";
import { AuthProvider } from "./services/authStore";
import { routeConfig } from "./router";

const App: Component = () => {
  return (
    <AuthProvider>
      <Router>
        {routeConfig}
      </Router>
    </AuthProvider>
  );
};

export default App;
