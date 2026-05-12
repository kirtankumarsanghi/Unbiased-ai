import { FormEvent, useState } from "react";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth/auth.service";
import { useAuthStore } from "../../app/store/auth.store";

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordChecks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase", pass: /[A-Z]/.test(password) },
  ];

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    try {
      await authService.ensureCsrf();
      const signup = await authService.signup(
        name.trim(),
        email.trim(),
        password,
      );
      const me = signup?.user ?? (await authService.me());
      setAuthUser({
        id: String(me.id),
        name: me.name ?? name.trim(),
        email: me.email ?? email.trim(),
        role: me.role ?? "ANALYST",
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,136,0.12),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(0,212,255,0.10),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Top Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.15em] text-muted hover:text-primary transition-colors"
        >
          Home
        </button>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-72px)] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md border border-border/80 bg-surface/75 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,255,136,0.08),0_20px_70px_rgba(0,0,0,0.45)] p-7 sm:p-10 rounded-sm">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary border border-primary/30 px-3 py-2 bg-primary/10">
            <ShieldCheck size={14} />
            Create Account
          </p>
          <h2 className="mt-6 text-3xl font-semibold text-primary">Sign Up</h2>
          <p className="mt-2 text-sm text-muted">
            Create your account to start auditing AI fairness
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            noValidate
          >
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                placeholder="John Doe"
                className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                  placeholder="Create a strong password"
                  className="w-full bg-background/50 border border-border px-4 py-3 pr-12 text-sm outline-none focus:border-primary transition-colors rounded-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Password strength indicators */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Check
                        size={12}
                        className={
                          check.pass ? "text-success" : "text-muted/40"
                        }
                      />
                      <span
                        className={
                          check.pass ? "text-success" : "text-muted/60"
                        }
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-error/10 border border-error/30 px-4 py-3 rounded-sm">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary/10 border border-primary/60 text-primary py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary/20 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed rounded-sm"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-xs text-muted mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                Sign in here
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
