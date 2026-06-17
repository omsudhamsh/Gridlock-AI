import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthPanel } from "./AuthPanel";

export function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthPanel
      title="Forgot password"
      subtitle="Request a reset link from the command center access desk."
      footer={<span>Remembered your password? <Link to="/login" className="text-cyan">Login</Link></span>}
    >
      <form onSubmit={submit} className="space-y-4">
        {sent && <div className="rounded-md border border-mint/20 bg-mint/10 p-3 text-sm text-mint">Reset instructions prepared for this demo flow.</div>}
        <label className="block text-sm text-slate-300">
          Official email
          <input type="email" required className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" />
        </label>
        <button className="w-full rounded-md bg-cyan px-4 py-3 font-semibold text-graphite">Send reset instructions</button>
      </form>
    </AuthPanel>
  );
}

