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

  const [notifications, setNotifications] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
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
      // Fetch profile image from DB
      fetch("/api/profile/avatar")
        .then((res) => res.json())
        .then((data) => { if (data.profileImage) setProfileImage(data.profileImage); });
    }
  }, [status, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: formData });
    const data = await res.json();
    if (data.profileImage) setProfileImage(data.profileImage);
    setUploading(false);
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen relative overflow-hidden font-sans pb-32">
      
      {/* Ultra-stable fixed background for mobile */}
      <div 
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/profile-bg-v2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />

      {/* ── TOP NAV BAR ── */}
      <header className="relative z-20 flex justify-between items-center px-6 pt-12 pb-4">
        <button onClick={() => router.back()} className="active:scale-90 transition-transform w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#4B2E28]" style={{ fontFamily: "var(--font-caveat), cursive", textShadow: "0 1px 4px rgba(255,255,255,0.7)" }}>Profile</h1>
        <button onClick={() => setIsPasswordExpanded(!isPasswordExpanded)} className="active:scale-90 transition-transform w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      {/* ── AVATAR & NAME ── */}
      <div className="relative z-20 flex flex-col items-center mt-4">
        {/* Clickable avatar with upload */}
        <label className="relative cursor-pointer group" htmlFor="avatar-upload">
          <div className="w-[120px] h-[120px] rounded-full border-[4px] border-white shadow-lg overflow-hidden"
            style={{ background: "rgba(255,255,255,0.6)" }}>
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
              </div>
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#4B2E28] opacity-50">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
          {/* Camera overlay */}
          <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2 border-white"
            style={{ background: "#4B2E28" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </label>
        <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

        {/* Name */}
        <div className="flex items-center gap-2 mt-4">
          {isEditingName ? (
            <input 
              type="text" value={name} onChange={e => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)} autoFocus
              className="text-[22px] font-bold text-[#3A2222] bg-white/70 border-b-2 border-[#4B2E28] outline-none text-center rounded px-2"
            />
          ) : (
            <h2 className="text-[22px] font-bold text-[#3A2222]" style={{ textShadow: "0 1px 4px rgba(255,255,255,0.8)" }}>{name}</h2>
          )}
          <button onClick={() => setIsEditingName(!isEditingName)} className="text-[#4B2E28] active:scale-90 transition-transform">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="relative z-20 flex px-6 mt-6">
        <div className="w-full rounded-3xl p-4 flex flex-col items-center justify-center border border-white/40 shadow-md"
          style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)" }}>
          <p className="text-[12px] text-[#5F4D4A] font-semibold tracking-wide uppercase">Memories Shared</p>
          <p className="text-[32px] font-bold text-[#4B2E28] leading-none mt-1">{memoryCount}</p>
        </div>
      </div>

      {/* ── MENU LIST ── */}
      <div className="relative z-20 px-6 mt-6 rounded-3xl overflow-hidden border border-white/40 shadow-md mx-6"
        style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(14px)" }}>
        <MenuItem 
          icon={<HeartSolid />} 
          label="My Memories" 
          onClick={() => router.push("/gallery")}
        />
        <MenuItem 
          icon={<GearOutline />} 
          label="Change Password" 
          onClick={() => router.push("/profile/change-password")}
        />
        <MenuItem 
          icon={<BellOutline />} 
          label="Notifications" 
          onClick={() => setNotifications(!notifications)}
          rightElement={
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${notifications ? 'bg-[#4B2E28]' : 'bg-[#D6C5C3]'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${notifications ? 'translate-x-4' : 'translate-x-0'}`}/>
            </div>
          }
        />
        <MenuItem 
          icon={<HeartSolid />} 
          label="Privacy & Security" 
          onClick={() => setIsPrivate(!isPrivate)}
          rightElement={
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isPrivate ? 'bg-[#4B2E28]' : 'bg-[#D6C5C3]'}`}>
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
      <div className="relative z-20 px-6 mt-6">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-white py-[18px] rounded-full text-[16px] font-semibold tracking-wide active:scale-95 transition-transform shadow-lg"
          style={{ background: "rgba(75,46,40,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
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
