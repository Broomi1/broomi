"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      loginType: "admin" // We can pass this to the backend if needed, or just let NextAuth handle it and check role later
    });

    if (res?.error) {
      setError("Invalid admin credentials");
      setLoading(false);
    } else {
      // After successful login, redirect to admin dashboard
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 text-stone-100 font-sans px-6">
      <div className="max-w-sm w-full bg-stone-800 p-8 rounded-2xl shadow-2xl border border-stone-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <span className="text-xl">⚙️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">System Admin</h1>
          <p className="text-sm text-stone-400 mt-1">MemoryTap Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/20 text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5" htmlFor="username">
              Admin Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5" htmlFor="password">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? "Authenticating..." : "Access System"}
          </button>
        </form>
      </div>
    </div>
  );
}
