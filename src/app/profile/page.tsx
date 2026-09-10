"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("New passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setIsError(false);
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setIsError(true);
      setMessage(data.error || "Failed to update password.");
    }
  };

  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="pt-12 pb-6 px-6 bg-gradient-to-b from-amber-50 to-stone-50">
        <h1 className="text-3xl font-medium text-stone-800">Profile</h1>
        <p className="text-stone-500 text-sm mt-1">Manage your account settings.</p>
      </header>

      <div className="px-6 space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700 shadow-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-stone-800 text-lg">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
              {user?.role === "admin" ? "Admin" : "Customer"}
            </span>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Change Password</h2>

          {message && (
            <div className={`text-sm p-3 rounded-xl mb-4 border ${isError ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-700 border-green-100"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full py-3.5 rounded-2xl bg-red-50 text-red-500 text-sm font-medium border border-red-100 hover:bg-red-100 transition-all active:scale-[0.98]"
        >
          Sign Out
        </button>
      </div>
      <Nav />
    </div>
  );
}
