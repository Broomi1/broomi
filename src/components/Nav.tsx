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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-2 bg-white/90 backdrop-blur-md border-t border-stone-100 shadow-lg rounded-t-3xl">
      {/* Home */}
      <NavItem href="/dashboard" icon={
        <svg className="w-5 h-5" fill={pathname === "/dashboard" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      } label="Home" active={pathname === "/dashboard"} />

      {/* Gallery */}
      <NavItem href="/gallery" icon={
        <svg className="w-5 h-5" fill={pathname === "/gallery" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      } label="Gallery" active={pathname === "/gallery"} />

      {/* Center Add button */}
      <Link
        href="/memories/new"
        className="w-14 h-14 rounded-full bg-stone-900 flex items-center justify-center shadow-xl -mt-5 border-4 border-white hover:bg-stone-800 transition-all active:scale-95"
      >
        <span className="text-white text-2xl font-light leading-none">+</span>
      </Link>

      {/* Profile */}
      <NavItem href="/profile" icon={
        <svg className="w-5 h-5" fill={pathname === "/profile" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      } label="Profile" active={pathname === "/profile"} />

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-[10px]">Logout</span>
      </button>
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
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? "text-amber-700" : "text-stone-400 hover:text-stone-700"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      {active && <div className="w-4 h-0.5 rounded-full bg-amber-600" />}
    </Link>
  );
}
