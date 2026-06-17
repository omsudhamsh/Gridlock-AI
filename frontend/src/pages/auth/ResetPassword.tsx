import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthPanel } from "./AuthPanel";

export function ResetPassword() {
  const [done, setDone] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setDone(true);
  };

  return (
    <AuthPanel
      title="Reset password"
      subtitle="Set a new password for your command center account."
      footer={<span>Go back to <Link to="/login" className="text-cyan">login</Link></span>}
    >
      <form onSubmit={submit} className="space-y-4">
        {done && <div className="rounded-md border border-mint/20 bg-mint/10 p-3 text-sm text-mint">Password reset captured for demo. Login with your registered credentials.</div>}
        <label className="block text-sm text-slate-300">New password<input type="password" required minLength={8} className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" /></label>
        <label className="block text-sm text-slate-300">Confirm password<input type="password" required minLength={8} className="mt-2 w-full rounded-md border border-line bg-graphite px-3 py-3 text-white outline-none focus:border-cyan" /></label>
        <button className="w-full rounded-md bg-cyan px-4 py-3 font-semibold text-graphite">Reset password</button>
      </form>
    </AuthPanel>
  );
}

