"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isSpace = pathname === "/gallery";

  if (role === "admin") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3 bg-white/90 backdrop-blur-md border-t border-stone-100 shadow-lg">
        <NavItem href="/admin"   label="Dashboard" active={pathname === "/admin"} isSpace={false}>⚙️</NavItem>
        <NavItem href="/profile" label="Profile"   active={pathname === "/profile"} isSpace={false}>👤</NavItem>
      </nav>
    );
  }

  /* ── colours based on current page ── */
  const bg         = isSpace ? "rgba(255,255,255,0.88)" : "#FCF5F0";
  const activeCol  = isSpace ? "#7B5AAC"                : "#B97C7C";
  const inactiveCol= isSpace ? "#8A7AAA"                : "#8B6A5B";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center" style={{ height:"88px" }}>
      <nav className="pointer-events-auto flex items-center justify-between px-4 w-full h-full relative"
        style={{ background: bg, backdropFilter:"blur(16px)", borderTop:"1px solid rgba(200,180,240,0.25)",
                  boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>

        {/* Wavy top border for non-space pages */}
        {!isSpace && (
          <svg viewBox="0 0 400 12" preserveAspectRatio="none"
            style={{ position:"absolute", top:"-11px", left:0, width:"100%", height:"12px", display:"block", zIndex:-1 }}>
            <path d="M0,12 L0,6 C30,6 50,0 80,5 C110,10 140,2 170,6 C195,10 205,10 230,6 C260,2 290,10 320,5 C350,0 370,6 400,6 L400,12 Z" fill={bg}/>
          </svg>
        )}

        <div className="flex items-center justify-around w-full h-full">
          {/* Home */}
          <NavItem href="/dashboard" label="Home" active={pathname === "/dashboard"} activeCol={activeCol} inactiveCol={inactiveCol} isSpace={isSpace}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/dashboard" ? activeCol : "none"}
              stroke={pathname === "/dashboard" ? activeCol : inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </NavItem>

          {/* Gallery — rocket on space page, image icon elsewhere */}
          <NavItem href="/gallery" label="Gallery" active={pathname === "/gallery"} activeCol={activeCol} inactiveCol={inactiveCol} isSpace={isSpace}>
            {isSpace ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={activeCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={pathname === "/gallery" ? activeCol : inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            )}
          </NavItem>

          {/* Center + button */}
          <div className="relative w-[70px] flex justify-center -mt-10 z-20">
            <Link href="/memories/new"
              className="w-[58px] h-[58px] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg"
              style={{ backgroundColor: isSpace ? "#2A1A3A" : "#4A3628",
                        border: `2px solid ${isSpace ? "rgba(160,120,200,0.4)" : "rgba(252,245,240,0.8)"}`,
                        boxShadow: isSpace ? "0 6px 20px rgba(100,60,150,0.4)" : "0 6px 16px rgba(185,124,124,0.35)" }}>
              <span className="text-white text-[30px] font-light leading-none relative" style={{ top:"-2px" }}>+</span>
            </Link>
          </div>

          {/* Profile — planet on space page, person elsewhere */}
          <NavItem href="/profile" label="Profile" active={pathname === "/profile"} activeCol={activeCol} inactiveCol={inactiveCol} isSpace={isSpace}>
            {isSpace ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8"/>
                <ellipse cx="12" cy="12" rx="14" ry="5" stroke={inactiveCol} strokeWidth="1.2"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={pathname === "/profile" ? activeCol : inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </NavItem>

          {/* Logout — tombstone on space page, door elsewhere */}
          <button onClick={() => signOut({ callbackUrl:"/login" })}
            className="flex flex-col items-center justify-center gap-1.5 transition-colors w-16">
            {isSpace ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="14" rx="7"/>
                <path d="M12 8v4M10 10h4"/><path d="M8 16h8v6H8z"/>
                <path d="M3 22h18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={inactiveCol} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            )}
            <span className="text-[11px] font-semibold" style={{ color: inactiveCol,
              fontFamily: isSpace ? "inherit" : "var(--font-caveat), cursive" }}>
              Logout
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, label, active, activeCol = "#B97C7C", inactiveCol = "#8B6A5B", isSpace = false, children }:
  { href:string; label:string; active:boolean; activeCol?:string; inactiveCol?:string; isSpace?:boolean; children:React.ReactNode }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-1.5 relative w-16">
      {children}
      <span className="text-[11px] font-semibold transition-colors"
        style={{ color: active ? activeCol : inactiveCol,
                  fontFamily: isSpace ? "inherit" : "var(--font-caveat), cursive" }}>
        {label}
      </span>
      {active && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full"
          style={{ backgroundColor: activeCol }}/>
      )}
    </Link>
  );
}
