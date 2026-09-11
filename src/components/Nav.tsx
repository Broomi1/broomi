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
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-6 py-3 bg-white/90 backdrop-blur-md border-t border-stone-100 shadow-lg">
        <NavItem href="/admin" icon="⚙️" label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/profile" icon="👤" label="Profile" active={pathname === "/profile"} />
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-5 left-4 right-4 z-50 flex items-center justify-between px-2 shadow-lg rounded-[32px] bg-[#FDFBF8]" style={{ padding: "0 10px", height: "72px", filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.05))" }}>
      
      {/* Left side items */}
      <div className="flex justify-around items-center flex-1 h-full">
        {/* Home */}
        <NavItem href="/dashboard" icon={
          pathname === "/dashboard" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#C37A5C" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B8276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          )
        } label="Home" active={pathname === "/dashboard"} />

        {/* Gallery */}
        <NavItem href="/gallery" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={pathname === "/gallery" ? "#C37A5C" : "#8B8276"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        } label="Gallery" active={pathname === "/gallery"} />
      </div>

      {/* Center Add button container to create the dip effect */}
      <div className="relative w-[72px] h-full flex justify-center flex-shrink-0">
        {/* The actual button */}
        <Link
          href="/memories/new"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md z-10"
          style={{ backgroundColor: "#222222" }}
        >
          <span className="text-white text-3xl font-light leading-none relative" style={{ top: "-2px" }}>+</span>
        </Link>
      </div>

      {/* Right side items */}
      <div className="flex justify-around items-center flex-1 h-full">
        {/* Profile */}
        <NavItem href="/profile" icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={pathname === "/profile" ? "#C37A5C" : "#8B8276"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
          </svg>
        } label="Profile" active={pathname === "/profile"} />

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center justify-center gap-1.5 h-full transition-colors w-16"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B8276" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="text-[11px] font-medium text-[#8B8276]">Logout</span>
        </button>
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
      className="flex flex-col items-center justify-center gap-1.5 relative h-full w-16"
    >
      {icon}
      <span className={`text-[11px] font-medium transition-colors ${active ? "text-[#C37A5C]" : "text-[#8B8276]"}`}>
        {label}
      </span>
      {active && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#C37A5C]" />
      )}
    </Link>
  );
}
