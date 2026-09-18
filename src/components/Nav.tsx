"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ── wavy top edge for nav ── */
const WavyTop = () => (
  <svg viewBox="0 0 400 30" preserveAspectRatio="none"
    style={{ position:"absolute", top:"-29px", left:0, width:"100%", height:"30px", display:"block", zIndex:-1 }}>
    <path d="M0,30 L0,15 C20,15 40,0 70,10 C100,20 130,5 160,15 C180,22 195,25 200,25 C205,25 220,22 240,15 C270,5 300,20 330,10 C360,0 380,15 400,15 L400,30 Z"
      fill="#F5E9E0" />
    <path d="M0,15 C20,15 40,0 70,10 C100,20 130,5 160,15 C180,22 195,25 200,25 C205,25 220,22 240,15 C270,5 300,20 330,10 C360,0 380,15 400,15"
      fill="none" stroke="#E8D5C8" strokeWidth="1" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (role === "admin") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3 bg-[#F5E9E0]/90 backdrop-blur-md border-t border-[#E8D5C8] shadow-lg">
        <NavItem href="/admin" icon={<span>⚙️</span>} label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/profile" icon={<span>👤</span>} label="Profile" active={pathname === "/profile"} />
      </nav>
    );
  }

  const isNewMemory = pathname === "/memories/new";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center" style={{ height: "90px" }}>
      <div className={`relative w-full flex items-center justify-between px-2 pb-6 pt-3 pointer-events-auto border-t border-transparent ${!isNewMemory ? "bg-[#F5E9E0]" : ""}`} style={{ filter: !isNewMemory ? "drop-shadow(0 -4px 10px rgba(0,0,0,0.04))" : "none" }}>
        
        {!isNewMemory && <WavyTop />}

        <div className="flex justify-around items-center w-full h-full z-10 px-2">
          {/* Home */}
          <NavItem href="/dashboard" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/dashboard" ? "#4B2E28" : "none"} stroke={pathname === "/dashboard" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          } label="Home" active={pathname === "/dashboard"} />

          {/* Gallery */}
          <NavItem href="/gallery" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/gallery" ? "#4B2E28" : "none"} stroke={pathname === "/gallery" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          } label="Gallery" active={pathname === "/gallery"} />

          {/* Center Add button */}
          <div className="relative flex justify-center w-[70px] -mt-10 z-20">
            <Link
              href="/memories/new"
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
              style={{ backgroundColor: "#4B2E28", border: "2px dashed #F5E9E0", boxShadow: "0 4px 12px rgba(75, 46, 40, 0.4)" }}
            >
              <span className="text-[#FDFBF8] text-[32px] font-light leading-none relative" style={{ top: "-2px" }}>+</span>
            </Link>
          </div>

          {/* Profile */}
          <NavItem href="/profile" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill={pathname === "/profile" ? "#4B2E28" : "none"} stroke={pathname === "/profile" ? "#4B2E28" : "#5F4D4A"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          } label="Profile" active={pathname === "/profile"} />

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex flex-col items-center justify-center gap-1.5 transition-colors w-16"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5F4D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="text-[14px] font-semibold text-[#5F4D4A]" style={{ fontFamily: "var(--font-caveat), cursive" }}>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1.5 relative w-16"
    >
      {icon}
      <span className={`text-[14px] transition-colors ${active ? "text-[#4B2E28] font-bold" : "text-[#5F4D4A]"}`} style={{ fontFamily: "var(--font-caveat), cursive" }}>
        {label}
      </span>
    </Link>
  );
}
