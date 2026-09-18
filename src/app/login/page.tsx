"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.push("/");
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
        loginType: "customer",
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
          await signIn("credentials", { redirect: false, username, password, loginType: "customer" });
          router.push("/dashboard");
        } else {
          setError(data.error || "Failed to create account");
          setLoading(false);
        }
      } catch {
        setError("An error occurred");
        setLoading(false);
      }
    }
  };

  if (status === "loading") return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center py-10 px-6"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative w-full max-w-[360px] mx-auto flex flex-col items-center">
        
        {/* ── STICKY NOTE (Top Left) ── */}
        <div
          className="absolute z-30"
          style={{
            top: "-40px",
            left: "-10px",
            transform: "rotate(-4deg)",
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.1))",
          }}
        >
          {/* Tape strip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 w-14 h-6 rounded-sm z-10"
            style={{ background: "rgba(110, 160, 220, 0.85)" }}
          />
          {/* Note body */}
          <div
            style={{
              background: "#FEF4C4",
              padding: "16px 20px 20px 18px",
              clipPath:
                "polygon(0% 4%,3% 0%,8% 2%,15% 0%,22% 3%,30% 0%,37% 2%,45% 0%,52% 3%,60% 1%,67% 3%,75% 0%,82% 2%,90% 0%,97% 2%,100% 0%,100% 95%,98% 98%,93% 96%,86% 99%,79% 97%,72% 100%,65% 97%,57% 99%,50% 96%,42% 100%,35% 97%,28% 99%,21% 96%,14% 100%,7% 97%,2% 99%,0% 96%)",
            }}
          >
            <p
              className="text-center leading-tight tracking-wide"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "19px",
                color: "#1F3B66",
                fontWeight: 600,
              }}
            >
              Good<br />Things<br />Take Time<br />
              <span style={{ fontSize: "20px", display: "inline-block", marginTop: "6px" }}>♡</span>
            </p>
          </div>
        </div>

        {/* ── FLOATING HEARTS ── */}
        <div className="absolute top-[40px] right-[10px] text-[#5C3F3B]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "24px", transform: "rotate(15deg)", opacity: 0.8 }}>♡</div>
        <div className="absolute bottom-[30px] left-[10px] text-[#B05C5C]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "24px", transform: "rotate(-15deg)", opacity: 0.8 }}>♡</div>

        {/* ── SPACING FOR STICKY NOTE ── */}
        <div style={{ height: "140px" }} />

        {/* ── TITLE SECTION ── */}
        <div className="w-full text-center mb-8 relative z-10">
          <h1
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "44px",
              fontWeight: 700,
              color: "#4A2B28",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              lineHeight: 1.1,
            }}
          >
            <span style={{ fontSize: "28px", color: "#4A2B28", marginTop: "4px" }}>-</span> 
            {isLogin ? "Welcome Back" : "Join Us"} 
            <span style={{ fontSize: "32px", fontWeight: 400 }}>♡</span>
            <span style={{ fontSize: "28px", color: "#4A2B28", marginTop: "4px" }}>-</span>
          </h1>
          <p style={{ color: "#5F4D4A", fontSize: "14px", lineHeight: 1.5, marginTop: "8px", fontWeight: 500 }}>
            {isLogin ? (
              <>Log in to continue your<br />memory journey ♡</>
            ) : (
              <>Sign up to begin your<br />memory journey ♡</>
            )}
          </p>
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="w-full space-y-5 relative z-10">
          {error && (
            <div style={{ background: "rgba(255, 237, 237, 0.9)", color: "#C04040", fontSize: "12px", padding: "10px 14px", borderRadius: "12px", textAlign: "center" }}>
              {error}
            </div>
          )}

          {/* Username Input */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2B28]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
              required
              style={{
                width: "100%",
                background: "#F5E9E0",
                border: "none",
                borderRadius: "999px",
                padding: "16px 44px 16px 48px",
                fontSize: "14px",
                color: "#4A2B28",
                outline: "none",
              }}
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A2B28]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: "100%",
                background: "#F5E9E0",
                border: "none",
                borderRadius: "999px",
                padding: "16px 48px 16px 48px",
                fontSize: "14px",
                color: "#4A2B28",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A2B28]"
            >
              {!showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          {/* Links Below Inputs */}
          <div className="flex justify-between items-center px-2 w-full mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-[#333333]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "17px", fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle></svg>
              Remember me
            </label>
            <button type="button" className="text-[#333333] hover:underline" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "17px", fontWeight: 500 }}>
              Forgot password?
            </button>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden"
              style={{
                background: "#4B2E28",
                color: "#FDFDFD",
                border: "none",
                borderRadius: "999px",
                padding: "16px 24px",
                fontSize: "22px",
                fontFamily: "var(--font-caveat), cursive",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(75, 46, 40, 0.2)",
              }}
            >
              {loading ? "Please wait..." : isLogin ? "Log In →" : "Sign Up →"}
            </button>
          </div>
        </form>

        {/* ── FOOTER TOGGLE ── */}
        <div className="w-full mt-10 relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 w-full mb-3" style={{ color: "#4A2B28" }}>
            <div style={{ height: "1px", background: "rgba(74, 43, 40, 0.3)", flex: 1, maxWidth: "60px" }} />
            <span style={{ fontSize: "15px", fontFamily: "var(--font-caveat), cursive", color: "#4A2B28" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <div style={{ height: "1px", background: "rgba(74, 43, 40, 0.3)", flex: 1, maxWidth: "60px" }} />
          </div>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "20px",
              color: "#4A2B28",
              background: "rgba(230, 195, 195, 0.6)",
              padding: "4px 16px",
              borderRadius: "12px",
              transition: "transform 0.1s",
            }}
            className="active:scale-95"
          >
            {isLogin ? "Sign Up ♡" : "Log In ♡"}
          </button>
        </div>

      </div>
    </div>
  );
}
