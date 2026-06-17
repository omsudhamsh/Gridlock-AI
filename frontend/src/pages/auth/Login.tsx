import { Eye, EyeOff, LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { AuthPanel } from "./AuthPanel";

export function Login() {
  const { login, isAuthenticated, sessionExpired, clearSessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      clearSessionExpired();
      const destination = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";
      navigate(destination, { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel
      title="Login"
      subtitle="Authenticate to access the Bengaluru traffic intelligence dashboard."
      footer={<span>New to Gridlock AI? <Link to="/register" className="text-cyan">Register an account</Link></span>}
    >
      <form onSubmit={submit} className="space-y-4">
        {sessionExpired && <div className="rounded-md border border-amber/20 bg-amber/10 p-3 text-sm text-amber">Session timed out. Please login again.</div>}
        {error && <div className="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{error}</div>}
        <label className="block text-sm text-slate-300">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <div className="mt-2 flex rounded-md border border-line bg-graphite focus-within:border-cyan">
            <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} required className="w-full rounded-md bg-transparent px-3 py-3 text-white outline-none" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid w-12 place-items-center text-slate-400">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-cyan">Forgot password?</Link>
        </div>
        <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-4 py-3 font-semibold text-graphite disabled:opacity-60">
          <LogIn className="h-4 w-4" /> {isSubmitting ? "Authenticating..." : "Login"}
        </button>
      </form>
    </AuthPanel>
  );
}

