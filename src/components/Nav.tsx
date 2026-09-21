"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (role === "admin") {
    return (
      <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none">
        <div 
          className="flex items-center gap-6 px-8 py-4 rounded-[2rem] shadow-2xl border border-white/40 pointer-events-auto backdrop-blur-xl"
          style={{ background: "rgba(250, 246, 240, 0.85)" }}
        >
          <NavDot href="/admin" label="Admin" active={pathname === "/admin"}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
          />
          <NavDot href="/profile" label="Profile" active={pathname === "/profile"}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center pointer-events-none px-4">
      
      {/* ── PERMANENT FLOATING DOCK ── */}
      <div
        className="flex items-center justify-between w-full max-w-sm rounded-[2rem] shadow-[0_8px_32px_rgba(75,46,40,0.15)] border border-white/50 pointer-events-auto backdrop-blur-xl"
        style={{
          background: "rgba(250, 246, 240, 0.9)",
          padding: "12px 24px",
        }}
      >
        <NavDot
          href="/dashboard"
          label="Home"
          active={pathname === "/dashboard"}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/dashboard" ? "#4B2E28" : "none"} stroke={pathname === "/dashboard" ? "#4B2E28" : "#8A7975"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          }
        />

        <NavDot
          href="/gallery"
          label="Gallery"
          active={pathname === "/gallery"}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/gallery" ? "#4B2E28" : "none"} stroke={pathname === "/gallery" ? "#4B2E28" : "#8A7975"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          }
        />

        {/* ── BIG ADD BUTTON ── */}
        <Link
          href="/memories/new"
          className="relative flex items-center justify-center rounded-full active:scale-95 transition-transform shrink-0 -mt-8 shadow-xl"
          style={{
            width: 60,
            height: 60,
            background: "linear-gradient(135deg, #4B2E28, #8A5A44)",
            border: "4px solid #FAF6F0"
          }}
        >
          <span className="text-[#FDFBF8] text-[34px] font-light leading-none" style={{ marginTop: -4 }}>+</span>
        </Link>

        <NavDot
          href="/profile"
          label="Profile"
          active={pathname === "/profile"}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/profile" ? "#4B2E28" : "none"} stroke={pathname === "/profile" ? "#4B2E28" : "#8A7975"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
        />

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform w-12"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A7975" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="text-[11px] font-semibold text-[#8A7975]" style={{ fontFamily: "var(--font-caveat), cursive" }}>Exit</span>
        </button>
      </div>
    </div>
  );
}

function NavDot({
  href, icon, label, active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform w-12"
    >
      <div className={`transition-transform ${active ? "-translate-y-0.5" : ""}`}>
        {icon}
      </div>
      <span
        className={`text-[11px] font-semibold transition-colors ${active ? "text-[#4B2E28]" : "text-[#8A7975]"}`}
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        {label}
      </span>
    </Link>
  );
}
