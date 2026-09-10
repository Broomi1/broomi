"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

interface User {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { memories: number };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newUsername, setNewUsername] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Reset password state
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
    const role = (session?.user as any)?.role;
    if (status === "authenticated" && role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  const loadUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated") loadUsers();
  }, [status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError("");
    setFormSuccess("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: tempPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setFormSuccess(`User "${newUsername}" created successfully!`);
      setNewUsername("");
      setTempPassword(generatePassword());
      loadUsers();
    } else {
      setFormError(data.error || "Failed to create user.");
    }
    setCreating(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    loadUsers();
  };

  const handleResetPassword = async (id: string) => {
    setResetting(true);
    await fetch(`/api/admin/users/${id}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: resetPassword }),
    });
    setResetting(false);
    setResetUserId(null);
    setResetPassword("");
  };

  function generatePassword() {
    return Math.random().toString(36).slice(-8) + Math.floor(Math.random() * 100);
  }

  useEffect(() => {
    setTempPassword(generatePassword());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <header className="pt-12 pb-6 px-6 bg-gradient-to-b from-purple-50 to-stone-50">
        <p className="text-xs font-medium text-purple-600 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-medium text-stone-800">Manage Users</h1>
        <p className="text-stone-500 text-sm mt-1">{users.length} total accounts</p>
      </header>

      <div className="px-6 space-y-5">
        {/* Create user form */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Create New Customer</h2>

          {formError && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-xl mb-3 border border-red-100">{formError}</div>}
          {formSuccess && <div className="text-sm text-green-700 bg-green-50 p-3 rounded-xl mb-3 border border-green-100">{formSuccess}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. sarah2026"
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Temporary Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-stone-800 font-mono text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setTempPassword(generatePassword())}
                  className="px-4 py-3 rounded-xl bg-stone-100 text-stone-600 text-sm hover:bg-stone-200 transition"
                >
                  🔄
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-3 rounded-xl bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {creating ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        {/* User list */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">All Users</h2>
          {users.map((user) => (
            <div key={user.id} className={`bg-white rounded-2xl p-4 border shadow-sm transition-all ${!user.isActive ? "opacity-60 border-red-100" : "border-stone-100"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800 text-sm">{user.username}</p>
                    <p className="text-xs text-stone-400">
                      {user.role} · {user._count?.memories ?? 0} memories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => setResetUserId(resetUserId === user.id ? null : user.id)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 transition"
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => toggleActive(user.id, user.isActive)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${user.isActive ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Reset password sub-form */}
              {resetUserId === user.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    placeholder="New password"
                    className="flex-1 px-3 py-2 text-sm rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-200 text-stone-800"
                  />
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    disabled={resetting || !resetPassword}
                    className="px-3 py-2 text-sm rounded-xl bg-purple-700 text-white font-medium hover:bg-purple-800 disabled:opacity-60 transition"
                  >
                    {resetting ? "..." : "Reset"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Nav />
    </div>
  );
}
