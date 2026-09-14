"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

/* ── wavy box edge ── */
const WavyBox = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative bg-[#FCF8F5]/95 backdrop-blur-sm rounded-[12px] p-4 shadow-sm border border-[#F0E6DF] ${className}`}>
    {children}
  </div>
);

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

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
      setTimeout(() => setIsPasswordExpanded(false), 2000);
    } else {
      setIsError(true);
      setMessage(data.error || "Failed to update password.");
    }
  };

  const user = session?.user as any;

  if (status === "loading") {
    return <div className="min-h-screen bg-[#FDF6F3]" />;
  }

  return (
    <div
      className="min-h-screen pb-32 font-sans"
      style={{
        backgroundImage: "url('/profile-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── HEADER ── */}
      <header className="pt-16 px-6 pb-6 relative z-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-center relative mb-1">
          <button onClick={() => router.back()} className="absolute left-0 text-[#3C2415]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="text-[2.8rem] font-bold text-[#3C2415] leading-none tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Settings
            <span className="text-[1.8rem] font-normal text-[#B97C7C]">♡</span>
          </h1>
        </div>
        <div className="relative">
          <p className="text-[1.2rem] text-[#7A665A]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}>
            Keep your account safe ♡
          </p>
          <svg width="120" height="10" viewBox="0 0 100 10" fill="none" className="absolute -bottom-2 right-4 opacity-60">
            <path d="M5,5 Q50,10 95,2" stroke="#A66B6B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M70,8 Q85,12 100,5" stroke="#A66B6B" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      <div className="px-5 space-y-4 relative z-10">
        {/* ── PROFILE CARD ── */}
        <div className="relative bg-[#FCF8F5]/95 backdrop-blur-sm rounded-[16px] p-5 shadow-sm border border-[#F0E6DF] flex items-center mb-6">
           {/* Tape Top Left */}
           <div className="absolute -top-3 -left-2 w-12 h-5 bg-[#EBA8B2]/80 border border-[#EBA8B2]/40 rotate-[-12deg] z-20 shadow-sm" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)" }}></div>
           
           <div className="flex-1 flex items-center gap-4 relative">
             <div className="relative">
               {/* Avatar */}
               <div className="w-[60px] h-[60px] rounded-full bg-[#FCECD4] border-2 border-dashed border-[#DE9A58] flex items-center justify-center text-[28px] font-bold text-[#3C2415]" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                 {user?.name?.[0]?.toUpperCase() || "W"}
               </div>
               {/* Crown Doodle */}
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3C2415" strokeWidth="1.5" className="absolute -top-4 right-0 rotate-[15deg]">
                 <path d="M2 20L4 6L10 12L12 4L14 12L20 6L22 20H2Z" strokeLinejoin="round" />
                 <circle cx="12" cy="2" r="1" fill="#3C2415" />
                 <circle cx="4" cy="4" r="1" fill="#3C2415" />
                 <circle cx="20" cy="4" r="1" fill="#3C2415" />
               </svg>
               {/* Tiny floating hearts */}
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3C2415" strokeWidth="2" className="absolute -left-2 top-4 rotate-[-20deg] opacity-60"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3C2415" strokeWidth="2" className="absolute left-1 -bottom-2 rotate-[15deg] opacity-60"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
             </div>

             <div>
               <h2 className="text-[1.8rem] font-bold text-[#3C2415] leading-none mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>{user?.name || "webloom"}</h2>
               <div className="inline-block px-3 py-0.5 rounded-full bg-[#F4D3D3] text-[#A66B6B] text-[12px] font-bold tracking-wide" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}>
                 Customer
               </div>
             </div>
           </div>

           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3C2415" strokeWidth="1.5" className="opacity-70">
             <polyline points="9 18 15 12 9 6"></polyline>
           </svg>

           {/* Large doodle heart bottom right */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A66B6B" strokeWidth="1.5" className="absolute bottom-2 right-6 opacity-80 rotate-[-15deg]">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
             <path d="M3 20 Q12 22 22 18" strokeWidth="1" strokeDasharray="2,2"/>
           </svg>
        </div>

        {/* ── SETTINGS MENU ── */}
        
        {/* Account Info */}
        <WavyBox className="flex items-center gap-4 px-5">
          <div className="w-11 h-11 rounded-full bg-[#F5DCDC] flex items-center justify-center text-[#7A4B4B]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="flex-1 py-1">
            <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Account Information</h3>
            <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">View and edit your details</p>
          </div>
          <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </WavyBox>

        {/* Change Password */}
        <div className="relative">
          <WavyBox className={`flex items-center gap-4 px-5 cursor-pointer transition-all ${isPasswordExpanded ? "rounded-b-none border-b-0" : ""}`}>
            <div onClick={() => setIsPasswordExpanded(!isPasswordExpanded)} className="w-full flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FCE5D4] flex items-center justify-center text-[#9E6437]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div className="flex-1 py-1">
                <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Change Password</h3>
                <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">Keep your account secure</p>
              </div>
              <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="rotate-[-45deg]"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${isPasswordExpanded ? "rotate-90" : ""}`}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          </WavyBox>
          
          {/* Expanded Password Form */}
          {isPasswordExpanded && (
            <div className="bg-[#FCF8F5]/95 backdrop-blur-sm px-6 pb-6 pt-2 rounded-b-[12px] shadow-sm border border-t-0 border-[#F0E6DF] mx-[1px] relative -top-[1px]">
              {message && (
                <div className={`text-[12px] p-3 rounded-xl mb-4 border font-medium ${isError ? "bg-[#FFEBEB] text-[#B54A4A] border-[#F0C0C0]" : "bg-[#EDF5EC] text-[#4A7A50] border-[#C0DFC0]"}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
                <div>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8D5C8] focus:outline-none focus:border-[#C28C8C] text-[#3C2415] text-[14px]" />
                </div>
                <div>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8D5C8] focus:outline-none focus:border-[#C28C8C] text-[#3C2415] text-[14px]" />
                </div>
                <div>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8D5C8] focus:outline-none focus:border-[#C28C8C] text-[#3C2415] text-[14px]" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#A66B6B] text-white text-[16px] font-bold hover:bg-[#8B5A5A] transition-all active:scale-[0.98] disabled:opacity-70 shadow-md"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {loading ? "Saving..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Notifications */}
        <WavyBox className="flex items-center gap-4 px-5">
          <div className="w-11 h-11 rounded-full bg-[#F5DCDC] flex items-center justify-center text-[#7A4B4B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <div className="flex-1 py-1">
            <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Notifications</h3>
            <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">Manage your alerts</p>
          </div>
          <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </WavyBox>

        {/* Privacy & Security */}
        <WavyBox className="flex items-center gap-4 px-5">
          <div className="w-11 h-11 rounded-full bg-[#FCE5D4] flex items-center justify-center text-[#9E6437]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
          </div>
          <div className="flex-1 py-1">
            <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Privacy & Security</h3>
            <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">Control your data</p>
          </div>
          <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="rotate-[-45deg]"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </WavyBox>

        {/* Help & Support */}
        <WavyBox className="flex items-center gap-4 px-5">
          <div className="w-11 h-11 rounded-full bg-[#F5DCDC] flex items-center justify-center text-[#7A4B4B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div className="flex-1 py-1">
            <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Help & Support</h3>
            <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">Get assistance</p>
          </div>
          <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </WavyBox>

        {/* Log Out */}
        <WavyBox className="flex items-center gap-4 px-5 cursor-pointer active:scale-[0.98] transition-transform" >
          <div className="w-11 h-11 rounded-full bg-[#FCE5D4] flex items-center justify-center text-[#9E6437]" onClick={() => signOut({ callbackUrl: "/login" })}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
          <div className="flex-1 py-1" onClick={() => signOut({ callbackUrl: "/login" })}>
            <h3 className="text-[1.4rem] font-bold text-[#3C2415] leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Log Out</h3>
            <p className="text-[11px] text-[#8B6A5B] font-medium uppercase tracking-wide">Sign out from your account</p>
          </div>
          <div className="flex items-center gap-1 text-[#3C2415] opacity-70">
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="rotate-[-45deg]"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </WavyBox>

      </div>
      
      <Nav />
    </div>
  );
}
