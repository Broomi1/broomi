"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const [isOpen, setIsOpen] = useState(false);

  // If on a page where we completely hide the nav, we could return null here. 
  // But currently Dashboard handles it by just not importing Nav.

  if (role === "admin") {
    return (
      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-col items-center justify-end pointer-events-none">
        <div 
          className={`flex items-center gap-4 px-6 py-3 rounded-full shadow-xl border border-white/30 transition-all duration-300 pointer-events-auto ${isOpen ? "translate-y-0 opacity-100 mb-6" : "translate-y-10 opacity-0 mb-0 invisible"}`}
          style={{ background: "rgba(245,233,224,0.92)", backdropFilter: "blur(16px)" }}
        >
          <NavDot href="/admin" label="Dashboard" active={pathname === "/admin"}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
          />
          <NavDot href="/profile" label="Profile" active={pathname === "/profile"}
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
        </div>
        
        {/* Toggle Line */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-1.5 rounded-full pointer-events-auto transition-colors active:scale-95"
          style={{ background: isOpen ? "rgba(75, 46, 40, 0.6)" : "rgba(75, 46, 40, 0.4)" }}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[60] flex flex-col items-center justify-end pointer-events-none">
      
      {/* Floating pill dock */}
      <div
        className={`flex items-center rounded-full shadow-2xl border border-white/30 overflow-visible transition-all duration-300 ease-out pointer-events-auto ${isOpen ? "translate-y-0 opacity-100 scale-100 mb-5" : "translate-y-12 opacity-0 scale-95 mb-0 pointer-events-none"}`}
        style={{
          background: "rgba(245,233,224,0.88)",
          backdropFilter: "blur(20px)",
          padding: "10px 20px",
          gap: "6px",
        }}
      >
        {/* Home */}
        <NavDot
          href="/dashboard"
          label="Home"
          active={pathname === "/dashboard"}
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill={pathname === "/dashboard" ? "#4B2E28" : "none"} stroke={pathname === "/dashboard" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          }
        />

        {/* Gallery */}
        <NavDot
          href="/gallery"
          label="Gallery"
          active={pathname === "/gallery"}
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill={pathname === "/gallery" ? "#4B2E28" : "none"} stroke={pathname === "/gallery" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          }
        />

        {/* Centre + button */}
        <Link
          href="/memories/new"
          className="relative flex items-center justify-center rounded-full active:scale-90 transition-transform shrink-0 mx-1"
          style={{
            width: 54,
            height: 54,
            background: "#4B2E28",
            boxShadow: "0 6px 18px rgba(75,46,40,0.45)",
          }}
        >
          {/* dashed inner ring */}
          <div className="absolute inset-[3px] rounded-full border-[1.5px] border-dashed border-[#F5E9E0]/60 pointer-events-none" />
          <span className="text-[#FDFBF8] text-[30px] font-light leading-none" style={{ marginTop: -2 }}>+</span>
        </Link>

        {/* Profile */}
        <NavDot
          href="/profile"
          label="Profile"
          active={pathname === "/profile"}
          icon={
            <svg width="21" height="21" viewBox="0 0 24 24" fill={pathname === "/profile" ? "#4B2E28" : "none"} stroke={pathname === "/profile" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
        />

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center justify-center gap-[3px] px-2 active:scale-90 transition-transform"
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#5F4D4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="text-[12px] font-semibold text-[#5F4D4A]" style={{ fontFamily: "var(--font-caveat), cursive" }}>Logout</span>
        </button>
      </div>

      {/* Toggle Line Indicator */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-1.5 rounded-full pointer-events-auto active:scale-95 transition-all"
        style={{ background: isOpen ? "rgba(75, 46, 40, 0.7)" : "rgba(75, 46, 40, 0.4)", backdropFilter: "blur(4px)" }}
      />
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
      className="flex flex-col items-center justify-center gap-[3px] px-2 active:scale-90 transition-transform"
    >
      {icon}
      <span
        className={`text-[12px] font-semibold transition-colors ${active ? "text-[#4B2E28]" : "text-[#5F4D4A]"}`}
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        {label}
      </span>
    </Link>
  );
}
