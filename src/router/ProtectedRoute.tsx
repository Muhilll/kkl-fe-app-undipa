/**
 * Protected Page Component
 * Wrapper for page components that require authentication
 */

import { useNavigate } from "@solidjs/router";
import { Component, JSX, Show, createEffect, createMemo } from "solid-js";
import { useAuth } from '../services/authStore';

interface ProtectedPageProps {
  children: JSX.Element;
}

const ProtectedPage: Component<ProtectedPageProps> = (props) => {
  const auth = useAuth();
  const navigate = useNavigate();

  // Check if authenticated - use memo to reactively check
  const isAuthenticated = createMemo(() => auth.isAuthenticated());

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <Show when={isAuthenticated()}>
      {props.children}
    </Show>
  );
};

export default ProtectedPage;
