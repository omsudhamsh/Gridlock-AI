import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { authApi, type User } from "../services/api";

export function RoleManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const canManage = user?.role === "Administrator" || user?.role === "Super Admin";

  useEffect(() => {
    if (!canManage) return;
    authApi.users().then(setUsers).catch(() => setError("Unable to load users."));
  }, [canManage]);

  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm text-slate-400">Role Management</p>
      <h3 className="mt-1 text-2xl font-semibold text-white">Access roles</h3>
      {!canManage ? (
        <div className="mt-6 rounded-md border border-amber/20 bg-amber/10 p-4 text-amber">Administrator or Super Admin role required to view all users.</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          {error && <div className="mb-4 rounded-md border border-danger/20 bg-danger/10 p-3 text-danger">{error}</div>}
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="border-b border-line py-3">Name</th>
                <th className="border-b border-line py-3">Email</th>
                <th className="border-b border-line py-3">Role</th>
                <th className="border-b border-line py-3">Department</th>
                <th className="border-b border-line py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id} className="text-slate-300">
                  <td className="border-b border-line/70 py-4 font-medium text-white">{item.name}</td>
                  <td className="border-b border-line/70 py-4">{item.email}</td>
                  <td className="border-b border-line/70 py-4">{item.role}</td>
                  <td className="border-b border-line/70 py-4">{item.department}</td>
                  <td className="border-b border-line/70 py-4">{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

