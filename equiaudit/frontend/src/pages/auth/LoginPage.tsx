import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import CyberButton from "../../components/common/CyberButton";

import { authService } from "../../services/auth/auth.service";
import { useAuthStore } from "../../app/store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      setAuth(response.access_token, {
        id: "local",
        name: email.split("@")[0] || "Analyst",
        email,
        role: "ADMIN",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        if (!err.response) {
          setError("Backend is unreachable. Start the API server.");
        } else {
          const detail =
            (err.response.data as { detail?: string })
              ?.detail || "Login failed. Check credentials.";

          setError(detail);
        }
      } else {
        setError("Login failed. Check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md bg-surface border border-border p-10">
        <h1 className="text-4xl font-bold text-primary">
          EquiAudit Access
        </h1>

        <p className="mt-3 text-muted">
          Authenticate to access governance controls.
        </p>

        <div className="mt-10 space-y-6">
          <div>
            <label className="block text-sm mb-2 text-muted uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-muted uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm"
            />
          </div>

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <CyberButton
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Authenticating" : "Enter"}
          </CyberButton>
        </div>
      </div>
    </div>
  );
}
