"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WelcomeAndLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      if (res?.error) {
        setError("Invalid username or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
          await signIn("credentials", { redirect: false, username, password });
          router.push("/dashboard");
        } else {
          setError(data.error || "Failed to create account");
          setLoading(false);
        }
      } catch {
        setError("Network error. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-end font-sans relative overflow-hidden"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Soft gradient overlay at the bottom so card blends in */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5ede4]/80 via-transparent to-transparent" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm mx-auto mb-0 pb-0">
        <div className="bg-white/90 backdrop-blur-md rounded-t-[2.5rem] px-7 pt-8 pb-10 shadow-2xl shadow-stone-400/20">

          {/* Lock icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#f0e8df] flex items-center justify-center border border-[#e2d5c8]">
              <svg className="w-5 h-5 text-[#7c6654]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-[1.75rem] font-semibold text-stone-800 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
              MemoryTap
            </h1>
            <p className="text-stone-500 text-sm mt-2 leading-relaxed">
              You've received a digital memory box.<br />
              Sign in or create an account to curate<br />
              your special moments.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#f0e8df] rounded-full p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                isLogin
                  ? "bg-[#e2cdb8] text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                !isLogin
                  ? "bg-[#e2cdb8] text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl border border-red-100 text-center">
                {error}
              </div>
            )}

            {/* Username field */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f7f2ed] border border-[#e8ddd4]">
                <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-transparent w-full text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f7f2ed] border border-[#e8ddd4]">
                <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-transparent w-full text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-stone-900 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-70 shadow-lg shadow-stone-900/20"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center mt-5">
            <Link href="/about" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              How does this work?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
