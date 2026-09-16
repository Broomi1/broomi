"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memoryCount, setMemoryCount] = useState(0);

  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState("Alex & Jamie");
  
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetch("/api/memories")
        .then((res) => res.json())
        .then((data) => setMemoryCount(data.length || 0))
        .catch(() => setMemoryCount(0));
    }
  }, [status, router]);

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
      setOldPass(""); setNewPass("");
      setTimeout(() => setIsPasswordExpanded(false), 2000);
    } else {
      setMsg((await res.json()).error || "Failed to update password.");
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans pb-32" style={{ backgroundColor: "#FAF4F1" }}>
      
      {/* ── HEADER BACKGROUND SHAPE ── */}
      <svg viewBox="0 0 400 240" preserveAspectRatio="none" 
        className="absolute top-0 left-0 w-full h-[240px] z-0">
        {/* Flat on right, scoop down on left */}
        <path fill="#AA6A73" d="M0 0 L400 0 L400 170 L160 170 C90 170 50 240 0 130 Z" />
      </svg>

      {/* ── FLOATING DECORATIONS ── */}
      {/* Solid Light Heart - top left */}
      <svg className="absolute top-[100px] left-[45px] z-10 w-7 h-7 text-[#E8D9D6] opacity-80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>

      {/* Outlined Heart - center right */}
      <svg className="absolute top-[110px] right-[80px] z-10 w-6 h-6 text-[#E8D9D6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>

      {/* Outlined Heart - center left under avatar */}
      <svg className="absolute top-[200px] left-[70px] z-10 w-5 h-5 text-[#C48C90]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>

      {/* Outlined Heart - right under polaroid */}
      <svg className="absolute top-[200px] right-[70px] z-10 w-6 h-6 text-[#C48C90]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>

      {/* Solid Dark Heart - far right middle */}
      <svg className="absolute top-[245px] right-[25px] z-10 w-7 h-7 text-[#AA6A73] opacity-90" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>

      {/* Floating Polaroid - Left */}
      <div className="absolute top-[170px] left-[-20px] z-10 transform -rotate-12 bg-[#F9F9F9] p-[6px] pb-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-sm w-[90px]">
        <div className="w-full aspect-square bg-[#AA6A73] rounded-sm relative">
          <svg className="absolute -top-3 -right-2 text-[#E48286] w-6 h-6" viewBox="0 0 24 24" fill="currentColor" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.2))" }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      {/* Floating Polaroid - Right */}
      <div className="absolute top-[80px] right-[-30px] z-10 transform rotate-12 bg-[#F9F9F9] p-[8px] pb-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-sm w-[100px]">
        <div className="w-full aspect-square bg-[#EAE2DB] rounded-sm"></div>
      </div>

      {/* ── TOP NAV BAR ── */}
      <header className="relative z-20 flex justify-between items-center px-6 pt-12 pb-4 text-white">
        <button onClick={() => router.back()} className="active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className="text-[19px] font-semibold tracking-wide">Profile</h1>
        <button onClick={() => setIsPasswordExpanded(!isPasswordExpanded)} className="active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* ── AVATAR & NAME ── */}
      <div className="relative z-20 flex flex-col items-center mt-3">
        <div className="w-[124px] h-[124px] rounded-full border-[4px] border-white shadow-md overflow-hidden bg-[#EADBD7]">
          <img src="/couple-polaroid.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2 mt-4 relative">
          {isEditingName ? (
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              onBlur={() => setIsEditingName(false)}
              autoFocus
              className="text-[24px] font-bold text-[#3A2222] tracking-tight bg-transparent border-b-2 border-[#AA6A73] outline-none text-center w-[200px]"
            />
          ) : (
            <h2 className="text-[24px] font-bold text-[#3A2222] tracking-tight">
              {name}
            </h2>
          )}
          <button onClick={() => setIsEditingName(!isEditingName)} className="text-[#9C7A7A] active:scale-90 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="relative z-20 flex gap-4 px-6 mt-6">
        <div className="flex-1 bg-[#EBE0DB] rounded-3xl p-4 flex flex-col items-center justify-center">
          <p className="text-[13px] text-[#5A4040] font-medium tracking-wide">Memories Shared</p>
          <p className="text-[28px] font-bold text-[#3A2222] leading-none mt-2">{memoryCount}</p>
        </div>
        <div className="flex-1 bg-[#EBE0DB] rounded-3xl p-4 flex flex-col items-center justify-center">
          <p className="text-[13px] text-[#5A4040] font-medium tracking-wide">Boxes Created</p>
          <p className="text-[28px] font-bold text-[#3A2222] leading-none mt-2">5</p>
        </div>
      </div>

      {/* ── MENU LIST ── */}
      <div className="relative z-20 px-6 mt-8 space-y-0 flex flex-col">
        <MenuItem 
          icon={<HeartSolid />} 
          label="My Memories" 
          onClick={() => router.push("/gallery")}
        />
        <MenuItem 
          icon={<GearOutline />} 
          label="Account Settings" 
          onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
        >
          {isPasswordExpanded && (
            <form onSubmit={handlePasswordChange} className="mt-2 space-y-3 bg-[#F4E9E6] p-4 rounded-xl">
              <input type="password" placeholder="Current Password" value={oldPass} onChange={e=>setOldPass(e.target.value)} required 
                className="w-full bg-white px-4 py-2.5 rounded-lg text-sm border-none outline-none text-[#3A2222]" />
              <input type="password" placeholder="New Password" value={newPass} onChange={e=>setNewPass(e.target.value)} required 
                className="w-full bg-white px-4 py-2.5 rounded-lg text-sm border-none outline-none text-[#3A2222]" />
              <button type="submit" className="w-full bg-[#AA6A73] text-white py-2.5 rounded-lg text-sm font-semibold mt-1">Update Password</button>
              {msg && <p className="text-xs text-center font-medium mt-2" style={{color: msg.includes('success') ? '#4A7C59' : '#C45252'}}>{msg}</p>}
            </form>
          )}
        </MenuItem>
        <MenuItem 
          icon={<BellOutline />} 
          label="Notifications" 
          onClick={() => setNotifications(!notifications)}
          rightElement={
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-[#AA6A73]' : 'bg-[#D6C5C3]'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${notifications ? 'translate-x-4' : 'translate-x-0'}`}/>
            </div>
          }
        />
        <MenuItem 
          icon={<HeartSolid />} 
          label="Privacy & Security" 
          onClick={() => setIsPrivate(!isPrivate)}
          rightElement={
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-[#AA6A73]' : 'bg-[#D6C5C3]'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${isPrivate ? 'translate-x-4' : 'translate-x-0'}`}/>
            </div>
          }
        />
        <MenuItem 
          icon={<QuestionOutline />} 
          label="Help & Support" 
          onClick={() => window.location.href = "mailto:support@memorytap.com"}
          isLast
        />
      </div>

      {/* ── SIGN OUT BUTTON ── */}
      <div className="relative z-20 px-6 mt-8">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full bg-[#3A2222] text-white py-[18px] rounded-full text-[16px] font-semibold tracking-wide active:scale-95 transition-transform shadow-lg"
        >
          Sign Out
        </button>
      </div>

      <Nav />
    </div>
  );
}

/* ── REUSABLE COMPONENTS & ICONS ── */

function MenuItem({ icon, label, isLast = false, onClick, children, rightElement }: { icon: React.ReactNode, label: string, isLast?: boolean, onClick?: () => void, children?: React.ReactNode, rightElement?: React.ReactNode }) {
  return (
    <div className={`flex flex-col py-1 ${!isLast ? 'border-b border-[#EBD0CD]' : ''}`}>
      <button onClick={onClick} className="flex items-center gap-4 py-3 w-full text-left active:scale-[0.98] transition-transform">
        <div className="w-6 h-6 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-[16px] text-[#3A2222] font-medium flex-1">{label}</span>
        {rightElement}
      </button>
      {children && (
        <div className="pb-3 px-1">
          {children}
        </div>
      )}
    </div>
  );
}

function HeartSolid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#A46B72">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function GearOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A46B72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function BellOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A46B72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function QuestionOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A46B72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}
