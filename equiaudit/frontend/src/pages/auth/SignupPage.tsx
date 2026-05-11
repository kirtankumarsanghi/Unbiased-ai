import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/auth/auth.service";
import { useAuthStore } from "../../app/store/auth.store";
import { authApi } from "../../services/api/auth.api";
import { useUIStore } from "../../app/store/ui.store";

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const backendReady = useUIStore((state) => state.backendReady);
  const setBackendReady = useUIStore((state) => state.setBackendReady);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkBackend = async () => {
      try {
        await authApi.status();
        if (mounted) setBackendReady(true);
      } catch {
        if (mounted) setBackendReady(false);
      }
    };
    checkBackend();
    const id = window.setInterval(checkBackend, 5000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, [setBackendReady]);

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
      const signup = await authService.signup(name.trim(), email.trim(), password);
      const me = signup?.user ?? (await authService.me());
      setAuthUser({
        id: String(me.id),
        name: me.name ?? name.trim(),
        email: me.email ?? email.trim(),
        role: me.role ?? "ANALYST",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,223,193,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,128,255,0.14),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,214,81,0.12),transparent_35%)]" />
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md border border-border/80 bg-surface/75 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,223,193,0.12),0_20px_70px_rgba(0,0,0,0.45)] p-7 sm:p-10">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-primary border border-primary/30 px-3 py-2 bg-primary/10">
            <ShieldCheck size={14} />
            Create Account
          </p>
          <h2 className="mt-6 text-3xl font-semibold text-primary">Sign Up</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Work email"
              className="w-full bg-background/50 border border-border px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full bg-background/50 border border-border px-4 py-3 pr-12 text-sm outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            {!backendReady && (
              <p className="text-sm text-warning">
                Backend is starting. Signup will be enabled automatically once service is ready.
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !backendReady}
              className="w-full border border-primary/60 bg-primary/10 text-primary py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-primary/20 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-xs uppercase tracking-[0.15em] text-primary hover:text-primary-dim transition-colors"
            >
              Back To Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
