import { FormEvent, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth/auth.service";
import { useAuthStore } from "../../app/store/auth.store";

type RoleOption =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "ANALYST"
  | "AUDITOR";

const roleOptions: {
  label: string;
  value: RoleOption;
}[] = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Org Admin", value: "ORG_ADMIN" },
  { label: "Analyst", value: "ANALYST" },
  { label: "Auditor", value: "AUDITOR" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleOption>("ANALYST");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const systemStats = useMemo(
    () => [
      { label: "Models Tracked", value: "128" },
      { label: "Live Audit Streams", value: "42" },
      { label: "Fairness Index", value: "0.93" },
      { label: "Critical Alerts", value: "03" },
    ],
    []
  );

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

  const handleForgotPassword = () => {
    if (!email) {
      setError("Enter your email to request reset.");
      return;
    }
    setError(null);
    setNotice(
      "Reset request simulated. In production, this triggers secure email workflow."
    );
    setForgotMode(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setNotice(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      setAuth(
        response.access_token,
        {
          id: "local",
          name:
            email.split("@")[0]
              ?.replace(/[._-]/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()) ||
            "Analyst",
          email,
          role,
        },
        rememberMe
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        if (!err.response) {
          setError("Backend unreachable. Start API server.");
        } else {
          const detail =
            (err.response.data as { detail?: string })?.detail ||
            "Authentication failed.";
          setError(detail);
        }
      } else {
        setError("Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,223,193,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,128,255,0.14),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,214,81,0.12),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:36px_36px] animate-pulse" />

      <main className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden lg:flex flex-col justify-between border-r border-border/60 p-10 xl:p-14">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary border border-primary/30 px-3 py-2 bg-primary/10">
              <ShieldCheck size={14} />
              Enterprise Governance Node
            </p>
            <h1 className="mt-8 text-5xl xl:text-6xl font-semibold leading-[1.05]">
              EquiAudit
              <span className="block text-primary">Access Terminal</span>
            </h1>
            <p className="mt-6 max-w-xl text-muted text-lg">
              Monitor fairness, drift, intervention, and compliance risks across mission-critical AI systems.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {systemStats.map((item) => (
              <div
                key={item.label}
                className="border border-border/70 bg-surface/70 backdrop-blur-md p-4"
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

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md border border-border/80 bg-surface/75 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,223,193,0.12),0_20px_70px_rgba(0,0,0,0.45)] p-7 sm:p-10">
            <h2 className="text-3xl font-semibold text-primary">
              Secure Login
            </h2>
            <p className="mt-3 text-sm text-muted">
              Authenticate to open the AI governance command center.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-[0.2em] text-muted mb-2"
                >
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                  placeholder="analyst@equiaudit.ai"
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
                    type={
                      showPassword ? "text" : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    className="w-full bg-background/50 border border-border px-4 py-3 pr-12 text-sm outline-none focus:border-primary transition-colors"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-xs uppercase tracking-[0.2em] text-muted mb-2"
                >
                  Session Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as RoleOption)
                  }
                  className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                >
                  {roleOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="accent-primary"
                  />
                  Remember this device
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setForgotMode((prev) => !prev)
                  }
                  className="uppercase tracking-[0.15em] text-primary hover:text-primary-dim transition-colors"
                >
                  Forgot Password
                </button>
              </div>

              {forgotMode && (
                <div className="border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                  <p>
                    Password reset simulator enabled for this demo.
                  </p>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="mt-3 border border-warning/40 px-3 py-2 uppercase tracking-widest hover:bg-warning/10 transition-colors"
                  >
                    Request Reset Link
                  </button>
                </div>
              )}

              {error && (
                <p
                  className="text-sm text-error"
                  role="alert"
                >
                  {error}
                </p>
              )}
              {notice && (
                <p
                  className="text-sm text-success"
                  role="status"
                >
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-primary/60 bg-primary/10 text-primary py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary/20 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Authenticating..."
                  : "Enter Governance Console"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
