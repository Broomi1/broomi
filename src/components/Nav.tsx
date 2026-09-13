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
      <nav className="fixed bottom-6 left-4 right-4 z-50 flex items-center justify-around px-6 py-3 bg-[#FCF8F5]/90 backdrop-blur-md rounded-full border border-[#F0E6DF] shadow-sm">
        <NavItem href="/admin" icon={<span>⚙️</span>} label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/profile" icon={<span>👤</span>} label="Profile" active={pathname === "/profile"} />
      </nav>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center">
      
      {/* ── FLOATING NAV BAR ── */}
      <nav 
        className="pointer-events-auto flex items-center justify-between px-2 w-[calc(100%-2rem)] max-w-md bg-[#FCF8F5]/95 backdrop-blur-md rounded-[28px] shadow-sm border border-[#F0E6DF] mb-2" 
        style={{ height: "76px", boxShadow: "0 8px 30px rgba(100, 70, 60, 0.08)" }}
      >
        <div className="flex justify-around items-center w-full h-full">
          {/* Home */}
          <NavItem href="/dashboard" icon={
            pathname === "/dashboard" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A66B6B">
                <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6A5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            )
          } label={pathname === "/dashboard" ? "Home ♡" : "Home"} active={pathname === "/dashboard"} />

          {/* Gallery */}
          <NavItem href="/gallery" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={pathname === "/gallery" ? "#A66B6B" : "#8B6A5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          } label="Gallery" active={pathname === "/gallery"} />

          {/* Profile */}
          <NavItem href="/profile" icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={pathname === "/profile" ? "#A66B6B" : "#8B6A5B"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
            </svg>
          } label="Profile" active={pathname === "/profile"} />

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex flex-col items-center justify-center gap-1.5 transition-colors w-16"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6A5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span className="text-[12px] text-[#8B6A5B]" style={{ fontFamily: "var(--font-caveat), cursive" }}>Logout</span>
          </button>
        </div>
      </nav>

      {/* ── BOTTOM DECORATION TEXT ── */}
      <div className="w-full flex justify-center pb-2 relative opacity-80 pointer-events-none">
        <span className="text-[14px] text-[#8B6A5B] flex items-center gap-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          More memories, more you <span className="text-[#A66B6B]">♡</span>
        </span>
        {/* Underline flourish right */}
        <svg width="40" height="20" viewBox="0 0 50 20" fill="none" className="absolute right-6 bottom-1">
          <path d="M5,15 Q25,25 45,5" stroke="#A66B6B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

    </div>
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
      className="flex flex-col items-center justify-center gap-1.5 w-16"
    >
      {icon}
      <span className={`text-[13px] transition-colors ${active ? "text-[#A66B6B] font-bold" : "text-[#8B6A5B]"}`} style={{ fontFamily: "var(--font-caveat), cursive" }}>
        {label}
      </span>
    </Link>
  );
}
