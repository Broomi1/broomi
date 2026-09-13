"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ── wavy top edge for nav ── */
const WavyTop = () => (
  <svg viewBox="0 0 400 30" preserveAspectRatio="none"
    style={{ position:"absolute", top:"-29px", left:0, width:"100%", height:"30px", display:"block", zIndex:-1 }}>
    <path d="M0,30 L0,15 C20,15 40,0 70,10 C100,20 130,5 160,15 C180,22 195,25 200,25 C205,25 220,22 240,15 C270,5 300,20 330,10 C360,0 380,15 400,15 L400,30 Z"
      fill="#FCF8F2" />
    <path d="M0,15 C20,15 40,0 70,10 C100,20 130,5 160,15 C180,22 195,25 200,25 C205,25 220,22 240,15 C270,5 300,20 330,10 C360,0 380,15 400,15"
      fill="none" stroke="#EBE3D5" strokeWidth="1" />
  </svg>
);

const LeafLeft = () => (
  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ position:"absolute", bottom:0, left:0, pointerEvents:"none" }}>
    <path d="M4 40 C4 20 10 10 20 5" stroke="#7A5C48" strokeWidth="1.2" fill="none" />
    <path d="M4 25 C10 25 15 20 15 15 C10 15 5 20 4 25 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
    <path d="M10 15 C15 15 20 10 20 5 C15 5 10 10 10 15 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
    <path d="M2 30 C8 30 12 25 12 20 C8 20 2 25 2 30 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
  </svg>
);

const LeafRight = () => (
  <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ position:"absolute", bottom:0, right:0, pointerEvents:"none" }}>
    <path d="M20 40 C20 20 14 10 4 5" stroke="#7A5C48" strokeWidth="1.2" fill="none" />
    <path d="M20 25 C14 25 9 20 9 15 C14 15 19 20 20 25 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
    <path d="M14 15 C9 15 4 10 4 5 C9 5 14 10 14 15 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
    <path d="M22 30 C16 30 12 25 12 20 C16 20 22 25 22 30 Z" stroke="#7A5C48" strokeWidth="1" fill="#FCF8F2" />
  </svg>
);

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  if (role === "admin") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3 bg-[#FCF8F2]/90 backdrop-blur-md border-t border-[#EBE3D5] shadow-lg">
        <NavItem href="/admin" icon={<span>⚙️</span>} label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/profile" icon={<span>👤</span>} label="Profile" active={pathname === "/profile"} />
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex flex-col justify-end pointer-events-none" style={{ height: "90px" }}>
      <div className="relative w-full bg-[#FCF8F2] flex items-center justify-between px-2 pb-6 pt-3 pointer-events-auto border-t border-transparent" style={{ filter: "drop-shadow(0 -4px 10px rgba(0,0,0,0.03))" }}>
        
        <WavyTop />
        <LeafLeft />
        <LeafRight />

        {/* Left side items */}
        <div className="flex justify-around items-center flex-1 h-full z-10 pl-2">
          {/* Home */}
          <NavItem href="/dashboard" icon={
            pathname === "/dashboard" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#8B7055" stroke="#4A3628" strokeWidth="1">
                <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A5C48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            )
          } label="Home" active={pathname === "/dashboard"} />

          {/* Gallery */}
          <NavItem href="/gallery" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pathname === "/gallery" ? "#8B7055" : "#7A5C48"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          } label="Gallery" active={pathname === "/gallery"} />
        </div>

        {/* Center Add button */}
        <div className="relative w-[70px] flex justify-center flex-shrink-0 z-20 pointer-events-auto">
          <Link
            href="/memories/new"
            className="absolute bottom-[-18px] w-[54px] h-[54px] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md border-2 border-[#FCF8F2]"
            style={{ backgroundColor: "#4A3628" }}
          >
            <span className="text-[#FDFBF8] text-[28px] font-light leading-none relative" style={{ top: "-2px" }}>+</span>
          </Link>
        </div>

        {/* Right side items */}
        <div className="flex justify-around items-center flex-1 h-full z-10 pr-2">
          {/* Profile */}
          <NavItem href="/profile" icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={pathname === "/profile" ? "#8B7055" : "#7A5C48"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          } label="Profile" active={pathname === "/profile"} />

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex flex-col items-center justify-center gap-1.5 transition-colors w-14"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A5C48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="text-[10px] font-semibold text-[#7A5C48]">Logout</span>
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
      className="flex flex-col items-center justify-center gap-1.5 relative w-14"
    >
      {icon}
      <span className={`text-[10px] font-semibold transition-colors ${active ? "text-[#8B7055]" : "text-[#7A5C48]"}`}>
        {label}
      </span>
      {active && (
        <svg width="18" height="4" viewBox="0 0 18 4" className="absolute -bottom-2 left-1/2 -translate-x-1/2">
           <path d="M1,2 Q9,0 17,2" stroke="#8B7055" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      )}
    </Link>
  );
}
