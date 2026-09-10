// Shared Nav for authenticated pages
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  let navLinks = [];
  const role = (session?.user as any)?.role;

  if (role === "admin") {
    navLinks = [
      { href: "/admin", label: "Dashboard", icon: "⚙️" },
      { href: "/profile", label: "Profile", icon: "👤" },
    ];
  } else {
    navLinks = [
      { href: "/dashboard", label: "Home", icon: "🏠" },
      { href: "/gallery", label: "Gallery", icon: "🖼️" },
      { href: "/memories/new", label: "Add", icon: "+" },
      { href: "/profile", label: "Profile", icon: "👤" },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-stone-100 shadow-[0_-1px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const isAdd = link.href === "/memories/new";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center px-3 py-2 rounded-2xl transition-all ${
                isAdd
                  ? "bg-stone-900 text-white px-5 py-3 rounded-2xl text-lg font-bold shadow-md"
                  : isActive
                  ? "text-amber-700"
                  : "text-stone-400 hover:text-stone-700"
              }`}
            >
              <span className={`text-xl ${isAdd ? "text-white" : ""}`}>{link.icon}</span>
              {!isAdd && (
                <span className="text-[10px] mt-0.5 font-medium">{link.label}</span>
              )}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-col items-center px-3 py-2 text-stone-400 hover:text-red-400 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span className="text-[10px] mt-0.5 font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
