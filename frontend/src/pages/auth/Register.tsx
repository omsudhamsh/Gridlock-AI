import { Eye, EyeOff, UserPlus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import type { UserRole } from "../../services/api";
import { AuthPanel } from "./AuthPanel";

const roles: UserRole[] = ["Traffic Police", "Traffic Operator", "Administrator", "Guest (Demo)", "Super Admin"];
const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Bengaluru Traffic Police");
  const [role, setRole] = useState<UserRole>("Guest (Demo)");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password)
    }),
    [password]
  );
  const validPassword = Object.values(passwordChecks).every(Boolean);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!emailPattern.test(email)) {
      setError("Enter a valid official email address.");
      return;
    }
    if (!validPassword) {
      setError("Password must satisfy all validation rules.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register({ name, email, password, role, department });
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Unable to register. The email may already exist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel
      title="Register"
      subtitle="Create a verified command center account for the dashboard."
      footer={<span>Already registered? <Link to="/login" className="text-cyan">Login</Link></span>}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <div className="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{error}</div>}
        <label className="block text-sm text-slate-300">Name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" /></label>
        <label className="block text-sm text-slate-300">Email<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-slate-300">Role<select value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan">{roles.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="block text-sm text-slate-300">Department<input value={department} onChange={(event) => setDepartment(event.target.value)} required className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" /></label>
        </div>
        <label className="block text-sm text-slate-300">
          Password
          <div className="mt-2 flex rounded-md border border-line bg-graphite focus-within:border-cyan">
            <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} required className="w-full rounded-md bg-transparent px-3 py-3 text-white outline-none" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid w-12 place-items-center text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ["8+ characters", passwordChecks.length],
            ["Uppercase", passwordChecks.upper],
            ["Lowercase", passwordChecks.lower],
            ["Number", passwordChecks.number]
          ].map(([label, ok]) => <span key={label as string} className={`rounded border px-2 py-1 ${ok ? "border-mint/20 bg-mint/10 text-mint" : "border-line bg-white/5 text-slate-500"}`}>{label as string}</span>)}
        </div>
        <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-4 py-3 font-semibold text-graphite disabled:opacity-60">
          <UserPlus className="h-4 w-4" /> {isSubmitting ? "Creating account..." : "Register and enter dashboard"}
        </button>
      </form>
    </AuthPanel>
  );
}

