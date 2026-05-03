import { Component, createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../../services/authStore";
import { authAPI } from "./api";

const LoginPage: Component = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: email(),
        password: password(),
      });

      if (response.success && response.data) {
        // Save token and user to auth store
        auth.login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="auth-page">
      <div class="auth-shell">
        <div class="auth-card">
          <div class="auth-brand">
            <div class="auth-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 12c0-4.418 3.582-8 8-8h4v4c0 4.418-3.582 8-8 8H6Zm0 0v.5A5.5 5.5 0 0 0 11.5 18H14"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>AgriIntel</span>
          </div>

          <div class="auth-copy">
            <h1>Sistem Laporan Kegiatan Disseminasi Informasi Pertanian</h1>
            <p>
              Enter your credentials to access the central intelligence
              dashboard.
            </p>
          </div>

          <Show when={error()}>
            <div class="error-message">{error()}</div>
          </Show>

          <form onSubmit={handleSubmit} class="auth-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="auth-input-wrap">
                <span class="auth-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9Z"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="m5 8 7 5 7-5"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  placeholder="name@agency.gov.id"
                  required
                  disabled={isLoading()}
                />
              </div>
            </div>

            <div class="form-group">
              <div class="auth-label-row">
                <label for="password">Password</label>
                <button type="button" class="auth-link-btn">
                  Forgot password?
                </button>
              </div>
              <div class="auth-input-wrap">
                <span class="auth-input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 10V7.5a4 4 0 1 1 8 0V10"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword() ? "text" : "password"}
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading()}
                />
                <button
                  type="button"
                  class="auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword() ? "Hide password" : "Show password"}
                >
                  {showPassword() ? (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M3 3 21 21"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <path
                        d="M10.58 10.58A2 2 0 0 0 13.4 13.4"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                      />
                      <path
                        d="M9.88 5.09A10.94 10.94 0 0 1 12 4.91c4.67 0 8.27 2.92 9.5 7.09a10.96 10.96 0 0 1-4.12 5.63"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6.61 6.62A11.01 11.01 0 0 0 2.5 12c.71 2.42 2.23 4.38 4.31 5.65"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        stroke-width="1.8"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" class="auth-submit-btn" disabled={isLoading()}>
              {isLoading() ? "Logging in..." : "Login To Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
