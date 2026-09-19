"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    if (!oldPass || !newPass) return setMsg("Please fill both fields.");
    
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
    });
    
    if (res.ok) {
      setMsg("Password updated successfully!");
      setOldPass(""); 
      setNewPass("");
      setTimeout(() => router.push("/profile"), 2000);
    } else {
      const data = await res.json();
      setMsg(data.error || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen relative font-sans p-6 flex flex-col justify-center">
      {/* Background */}
      <div 
        className="pointer-events-none"
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundImage: "url('/profile-bg-v2.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <button onClick={() => router.back()} className="mb-6 active:scale-90 transition-transform w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>

        <div className="rounded-3xl p-6 border border-white/40 shadow-xl"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)" }}>
          <h1 className="text-[28px] font-bold text-[#4B2E28] mb-6 text-center" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Change Password
          </h1>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#5F4D4A] mb-1 pl-1">Current Password</label>
              <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required 
                className="w-full bg-white/80 px-4 py-3 rounded-xl text-md border border-white/50 outline-none text-[#3A2222] shadow-sm focus:border-[#4B2E28] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5F4D4A] mb-1 pl-1">New Password</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required 
                className="w-full bg-white/80 px-4 py-3 rounded-xl text-md border border-white/50 outline-none text-[#3A2222] shadow-sm focus:border-[#4B2E28] transition-colors" />
            </div>
            
            <button type="submit" className="w-full mt-4 text-white py-3.5 rounded-xl text-[16px] font-semibold tracking-wide active:scale-95 transition-transform shadow-md"
              style={{ background: "#4B2E28" }}>
              Update Password
            </button>
            
            {msg && (
              <p className="text-sm text-center font-medium mt-4 bg-white/50 py-2 rounded-lg" 
                 style={{ color: msg.includes('success') ? '#2e5c3e' : '#C45252' }}>
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
