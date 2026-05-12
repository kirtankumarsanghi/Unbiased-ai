import { FormEvent, useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth/auth.service";
import { useAuthStore } from "../../app/store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email to request reset.");
      return;
    }
    setError(null);
    try {
      const result = await authService.forgotPassword(email);
      setNotice(result?.message || "Reset request submitted.");
      setForgotMode(false);
    } catch {
      setError("Unable to initiate reset. Try again.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.ensureCsrf();
      const loginResult = await authService.login(email, password, rememberMe);
      const me = loginResult?.user ?? (await authService.me());

      setAuthUser({
        id: String(me?.id),
        name: String(me?.name || "Analyst"),
        email: String(me?.email || email),
        role: String(me?.role || "ANALYST"),
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setNotice(null);
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,136,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,212,255,0.10),transparent_30%),radial-gradient(circle_at_60%_80%,rgba(255,170,0,0.08),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Top Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="text-xs uppercase tracking-[0.15em] text-primary border border-primary/30 bg-primary/5 px-4 py-2 hover:bg-primary/15 transition-all"
        >
          Create Account
        </button>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-72px)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left branding panel */}
        <section className="hidden lg:flex flex-col justify-center border-r border-border/60 p-10 xl:p-14">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary border border-primary/30 px-3 py-2 bg-primary/10">
              <ShieldCheck size={14} />
              AI Fairness Platform
            </p>
            <h1 className="mt-8 text-5xl xl:text-6xl font-semibold leading-[1.05]">
              Unbiased AI
              <span className="block text-primary mt-2">Access Portal</span>
            </h1>
            <p className="mt-6 text-muted max-w-md leading-relaxed">
              Sign in to access your AI fairness dashboard, run bias audits,
              analyze explainability metrics, and manage intervention pipelines.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { label: "Active Models", value: "128" },
              { label: "Audits Running", value: "42" },
              { label: "Fairness Score", value: "93%" },
              { label: "Alerts Today", value: "3" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-border/70 bg-surface/70 backdrop-blur-md p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right login form */}
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md border border-border/80 bg-surface/75 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,255,136,0.08),0_20px_70px_rgba(0,0,0,0.45)] p-7 sm:p-10 rounded-sm">
            <h2 className="text-3xl font-semibold text-primary">Sign In</h2>
            <p className="mt-2 text-sm text-muted">
              Enter your credentials to access the platform
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-[0.2em] text-muted mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                  className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors rounded-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-[0.2em] text-muted mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError(null);
                    }}
                    className="w-full bg-background/50 border border-border px-4 py-3 pr-12 text-sm outline-none focus:border-primary transition-colors rounded-sm"
                    placeholder="Min 8 characters"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="accent-primary"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMode((prev) => !prev)}
                  className="uppercase tracking-[0.15em] text-primary hover:text-primary-dark transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              {forgotMode && (
                <div className="border border-warning/40 bg-warning/10 p-3 text-xs text-warning rounded-sm">
                  <p className="mb-2">
                    We'll send a reset link to your email address.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="border border-warning/40 px-3 py-2 uppercase tracking-widest hover:bg-warning/10 transition-colors"
                  >
                    Request Reset Link
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-error/10 border border-error/30 px-4 py-3 rounded-sm">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}
              {notice && (
                <div className="bg-success/10 border border-success/30 px-4 py-3 rounded-sm">
                  <p className="text-sm text-success">{notice}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary/10 border border-primary/60 text-primary py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary/20 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>

              <p className="text-center text-xs text-muted mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 border-t border-border/50 pt-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
                Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted">
                <div className="bg-background/50 border border-border/50 p-2 rounded-sm">
                  <p className="text-primary text-[10px]">Admin</p>
                  <p>admin@equiaudit.ai</p>
                  <p>Admin@123</p>
                </div>
                <div className="bg-background/50 border border-border/50 p-2 rounded-sm">
                  <p className="text-primary text-[10px]">Analyst</p>
                  <p>analyst@equiaudit.ai</p>
                  <p>Analyst@123</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
