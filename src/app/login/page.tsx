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
      className="min-h-screen flex items-center justify-center py-10 px-4"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Outer wrapper — holds sticky note + card */}
      <div className="relative w-full max-w-[400px] mx-auto pb-0">

        {/* ── STICKY NOTE (torn paper, overlapping top-left) ── */}
        <div
          className="absolute z-30"
          style={{
            top: "-10px",
            left: "-8px",
            transform: "rotate(-8deg)",
            filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.18))",
          }}
        >
          {/* Tape strip at top */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-3 w-10 h-5 rounded-sm z-10"
            style={{ background: "rgba(210,190,165,0.75)" }}
          />
          {/* Torn paper body */}
          <div
            style={{
              background: "#F2E6D0",
              padding: "14px 18px 14px 16px",
              clipPath:
                "polygon(0% 4%,3% 0%,8% 2%,15% 0%,22% 3%,30% 0%,37% 2%,45% 0%,52% 3%,60% 1%,67% 3%,75% 0%,82% 2%,90% 0%,97% 2%,100% 0%,100% 95%,98% 98%,93% 96%,86% 99%,79% 97%,72% 100%,65% 97%,57% 99%,50% 96%,42% 100%,35% 97%,28% 99%,21% 96%,14% 100%,7% 97%,2% 99%,0% 96%)",
            }}
          >
            <p
              className="text-center leading-snug"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "17px",
                color: "#5C3D2E",
                lineHeight: 1.3,
              }}
            >
              Better<br />Moments<br />Together<br />
              <span style={{ fontSize: "20px" }}>♡</span>
            </p>
          </div>
        </div>

        {/* ── MAIN ARCH CARD ── */}
        <div
          className="w-full relative"
          style={{
            background: "#FAF4EF",
            borderRadius: "200px 200px 48px 48px",
            boxShadow: "0 8px 48px rgba(80,40,20,0.13)",
            overflow: "visible",
            paddingBottom: "32px",
          }}
        >
          {/* ── POLAROID SECTION ── */}
          <div className="flex justify-center pt-12 relative" style={{ marginBottom: "-8px" }}>
            <div className="relative" style={{ width: "130px", height: "130px" }}>

              {/* Back polaroid (tilted right) */}
              <div
                className="absolute"
                style={{
                  background: "white",
                  padding: "8px 8px 26px 8px",
                  borderRadius: "3px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transform: "rotate(9deg) translate(14px, 4px)",
                  width: "110px",
                  height: "110px",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                }}
              >
                <div style={{ width: "100%", height: "100%", background: "#E8D8CC", borderRadius: "2px" }} />
              </div>

              {/* Front polaroid */}
              <div
                className="absolute"
                style={{
                  background: "white",
                  padding: "8px 8px 28px 8px",
                  borderRadius: "3px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                  transform: "rotate(-4deg)",
                  width: "110px",
                  height: "110px",
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  overflow: "hidden",
                }}
              >
                <img
                  src="/couple-polaroid.jpg"
                  alt="Couple"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", borderRadius: "2px" }}
                />
              </div>

              {/* Heart pin */}
              <div
                className="absolute"
                style={{
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  color: "#E07B7B",
                  fontSize: "22px",
                  filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))",
                }}
              >
                ♥
              </div>

              {/* Decorative hearts & dashes around polaroid */}
              <div style={{ position: "absolute", top: "30px", left: "-30px", color: "#8B5E5E", fontFamily: "var(--font-caveat), cursive", fontSize: "20px", transform: "rotate(-10deg)", opacity: 0.7 }}>♡</div>
              <div style={{ position: "absolute", top: "60px", left: "-22px", width: "14px", height: "2px", background: "#8B5E5E", borderRadius: "2px", transform: "rotate(40deg)", opacity: 0.5 }} />
              <div style={{ position: "absolute", top: "74px", left: "-16px", width: "10px", height: "2px", background: "#8B5E5E", borderRadius: "2px", transform: "rotate(-20deg)", opacity: 0.5 }} />

              <div style={{ position: "absolute", top: "18px", right: "-30px", color: "#8B5E5E", fontFamily: "var(--font-caveat), cursive", fontSize: "20px", transform: "rotate(10deg)", opacity: 0.7 }}>♡</div>
              <div style={{ position: "absolute", top: "48px", right: "-22px", width: "14px", height: "2px", background: "#8B5E5E", borderRadius: "2px", transform: "rotate(-40deg)", opacity: 0.5 }} />
              <div style={{ position: "absolute", top: "62px", right: "-16px", width: "10px", height: "2px", background: "#8B5E5E", borderRadius: "2px", transform: "rotate(20deg)", opacity: 0.5 }} />
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center px-6 pt-6">
            <h1
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "48px",
                fontWeight: 700,
                color: "#3D1A14",
                lineHeight: 1.1,
                marginBottom: "4px",
              }}
            >
              MemoryTap
            </h1>
            <div style={{ color: "#9B7168", fontSize: "14px", letterSpacing: "2px", marginBottom: "10px" }}>
              — ♡ —
            </div>
            <p style={{ color: "#7A5650", fontSize: "13px", lineHeight: 1.6, marginBottom: "4px" }}>
              You've received a digital memory box.<br />
              Sign in or create an account to curate<br />
              your special moments.
            </p>
            <div style={{ color: "#9B7168", fontSize: "22px", fontFamily: "var(--font-caveat), cursive" }}>♡</div>
          </div>

          {/* ── TOGGLE TABS ── */}
          <div className="px-6 mt-2">
            <div
              style={{
                background: "#EADBD4",
                borderRadius: "999px",
                padding: "5px",
                display: "flex",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  bottom: "5px",
                  left: isLogin ? "5px" : "calc(50%)",
                  width: "calc(50% - 5px)",
                  background: "#B87070",
                  borderRadius: "999px",
                  transition: "left 0.3s ease",
                  boxShadow: "0 2px 6px rgba(120,50,40,0.2)",
                }}
              />
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: isLogin ? "#fff" : "#7A5650",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  zIndex: 1,
                  position: "relative",
                  transition: "color 0.2s",
                }}
              >
                {isLogin ? "♥" : "♡"} Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: !isLogin ? "#fff" : "#7A5650",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  zIndex: 1,
                  position: "relative",
                  transition: "color 0.2s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg> Create Account
              </button>
            </div>
          </div>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="px-6 mt-5 space-y-4">
            {error && (
              <div style={{ background: "#FFEDED", color: "#C04040", fontSize: "12px", padding: "10px 14px", borderRadius: "12px", textAlign: "center" }}>
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 800, color: "#3D1A14", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                <span style={{ color: "#B87070" }}>♥</span> Username
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9B7168", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{
                    width: "100%",
                    background: "#EDE0D8",
                    border: "none",
                    borderRadius: "999px",
                    padding: "14px 16px 14px 44px",
                    fontSize: "14px",
                    color: "#3D1A14",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 800, color: "#3D1A14", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                <span style={{ color: "#B87070" }}>♥</span> Password
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9B7168", display: "flex" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    background: "#EDE0D8",
                    border: "none",
                    borderRadius: "999px",
                    padding: "14px 48px 14px 44px",
                    fontSize: "14px",
                    color: "#3D1A14",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9B7168",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div style={{ position: "relative", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#4A2520",
                  color: "#fff",
                  border: "none",
                  borderRadius: "999px",
                  padding: "16px 24px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span>{loading ? "Please wait..." : isLogin ? "Sign In  →" : "Create Account  →"}</span>

                {/* Sparkle heart circle on right side of button */}
                {!loading && (
                  <div
                    style={{
                      position: "absolute",
                      right: "24px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#E8C4C4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "24px" }}>♡</span>
                    <span style={{ position: "absolute", top: "-4px", left: "-6px", fontSize: "10px", transform: "rotate(-20deg)" }}>/</span>
                    <span style={{ position: "absolute", top: "2px", left: "-10px", fontSize: "10px", transform: "rotate(-60deg)" }}>-</span>
                    <span style={{ position: "absolute", top: "-8px", right: "2px", fontSize: "10px", transform: "rotate(20deg)" }}>\</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* ── BOTTOM DECORATIONS ── */}
          <div className="px-6 mt-5 relative" style={{ minHeight: "56px" }}>
            {/* Double overlapping hearts - bottom left */}
            <div style={{ position: "absolute", left: "20px", bottom: "-4px", color: "#C07070", fontSize: "22px", fontFamily: "var(--font-caveat), cursive", display: "flex" }}>
              <span style={{ transform: "rotate(-15deg)", marginRight: "-10px", opacity: 0.8 }}>♡</span>
              <span style={{ transform: "rotate(10deg) translateY(4px)", opacity: 0.9 }}>♡</span>
            </div>

            {/* How does this work */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "#9B7168", fontSize: "12px" }}>
              <div style={{ height: "1px", background: "#C4A099", width: "40px" }} />
              <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "#9B7168", fontSize: "12px" }}>
                How does this work?
              </button>
              <div style={{ height: "1px", background: "#C4A099", width: "40px" }} />
            </div>
            <div style={{ textAlign: "center", color: "#9B7168", fontFamily: "var(--font-caveat), cursive", fontSize: "22px", marginTop: "4px" }}>♡</div>

            {/* Small heart - bottom right outside card */}
            <div style={{ position: "absolute", right: "8px", bottom: "0px", color: "#C07070", fontFamily: "var(--font-caveat), cursive", fontSize: "20px", opacity: 0.6 }}>♡</div>
          </div>

          {/* Bottom padding */}
          <div style={{ height: "16px" }} />
        </div>
      </div>
    </div>
  );
}
