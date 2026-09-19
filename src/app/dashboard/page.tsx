"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";

interface Memory {
  id: string;
  title: string;
  description: string | null;
  type: string;
  mediaUrl: string | null;
  date: string;
  createdAt: string;
}

function formatDateDisplay(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/memories")
        .then((res) => res.json())
        .then((data) => { setMemories(data); setLoading(false); });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#A8C8E0" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const user = session?.user as any;
  const firstName = user?.name?.split(" ")[0] || "weblom";
  const recentMemories = memories.slice(0, 5);
  const featuredMemory = memories.find((m) => m.mediaUrl) || memories[0];

  return (
    <div className="min-h-screen font-sans pb-32 relative" style={{ backgroundColor: "#A8C8E0" }}>
      {/* Ultra-stable fixed background for mobile (prevents iOS jump & zoom issues) */}
      <div 
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/home-bg-new2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-24 px-6 pb-4">
        <p className="text-[1.6rem] text-[#4B2E28] font-semibold mb-[-4px]" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Good to see you,
        </p>
        <h1 className="text-[5rem] font-bold text-[#4B2E28] leading-none tracking-tight flex items-center gap-2 mb-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          {firstName}
          <span className="text-[3rem]">&#9825;</span>
        </h1>
        <p className="text-[1.4rem] text-[#4B2E28] leading-[1.4] font-semibold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Your memories<br />
          are little pieces<br />
          of happiness &#9825;
        </p>
        {/* Small heart doodle top-right */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="1.5" className="absolute top-16 right-28 opacity-80">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </header>

      {/* Cards section - starts below the header text area */}
      <div className="relative z-10 px-4 mt-[175px]">

        {/* Today Memory Card */}
        {featuredMemory && (
          <div className="relative mb-6">
            <div
              className="absolute -top-3 left-5 z-20 px-4 py-1 rounded-sm shadow-sm"
              style={{ background: "#F5E9E0", border: "1px solid #E8D5C8", transform: "rotate(-2deg)" }}
            >
              <span className="text-[15px] font-bold text-[#4B2E28]" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Today&apos;s Memory &#9825;
              </span>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-4 pt-6 shadow-sm border border-[#E8D5C8]/60 relative">
              <div className="absolute top-4 right-4 text-[#4B2E28] opacity-60">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                </svg>
              </div>
              <div className="flex gap-4">
                <div className="w-[120px] h-[110px] shrink-0 rounded-[18px] overflow-hidden bg-[#F5E9E0] shadow-sm">
                  {featuredMemory.mediaUrl ? (
                    <img src={featuredMemory.mediaUrl} alt={featuredMemory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {featuredMemory.type === "text" ? "??" : "???"}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[2rem] font-bold text-[#4B2E28] leading-none mb-1 pr-5" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                    {featuredMemory.title} &#9825;
                  </h3>
                  <p className="text-[#5F4D4A] text-[14px] mb-2 line-clamp-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                    {featuredMemory.description || "Special day"}
                  </p>
                  <div className="flex items-center gap-2 text-[#4B2E28] text-[12px] font-semibold">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formatDateDisplay(featuredMemory.date)}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 right-4 flex items-end gap-1 text-[#4B2E28] opacity-60">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
            </div>
          </div>
        )}

        {/* Add Memory Button */}
        <Link
          href="/memories/new"
          className="w-full rounded-[36px] flex items-center justify-between py-5 px-6 mb-8 shadow-md transition-transform active:scale-[0.98]"
          style={{ backgroundColor: "#4B2E28" }}
        >
          <div className="flex items-center gap-4">
            <div className="relative text-white flex-shrink-0">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
              </svg>
              <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute -top-3 -right-3 text-white/80">
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            </div>
            <div className="text-white ml-2">
              <h3 className="text-[1.6rem] font-medium leading-none mb-0.5" style={{ fontFamily: "var(--font-caveat), cursive" }}>Add Memory</h3>
              <p className="text-[11px] opacity-90 tracking-wide" style={{ fontFamily: "monospace" }}>Capture a moment, keep it forever ?</p>
            </div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>

        {/* Recent Memories */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#4B2E28">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h2 className="text-[1.8rem] font-bold text-[#4B2E28]" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Recent Memories
              </h2>
            </div>
            <Link href="/gallery" className="text-[#4B2E28] text-[1.1rem] font-semibold hover:opacity-70" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              View All ?
            </Link>
          </div>

          <div className="space-y-3">
            {recentMemories.map((memory) => (
              <Link
                href={`/memories/${memory.id}/edit`}
                key={memory.id}
                className="bg-white/90 backdrop-blur-sm rounded-[22px] flex items-center gap-3 shadow-sm border border-[#E8D5C8]/50 relative overflow-hidden"
              >
                <div className="w-[80px] h-[80px] shrink-0 rounded-l-[22px] overflow-hidden bg-[#F5E9E0]">
                  {memory.mediaUrl ? (
                    <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {memory.type === "text" ? "??" : memory.type === "voice" ? "???" : "??"}
                    </div>
                  )}
                </div>
                <div className="flex-1 py-3 pr-10">
                  <h3 className="font-bold text-[#4B2E28] text-[1.35rem] leading-none mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                    {memory.title} &#9825;
                  </h3>
                  <div className="flex items-center gap-1.5 text-[#5F4D4A] text-[12px] font-semibold">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formatDateDisplay(memory.date)}
                  </div>
                </div>
                <div className="absolute right-3 top-3 text-[#5F4D4A]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
                <div className="absolute right-3 bottom-3 text-[#5F4D4A]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
              </Link>
            ))}

            {recentMemories.length === 0 && (
              <div className="text-center py-10 text-[#4B2E28] font-medium bg-white/70 rounded-[22px]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem" }}>
                No memories yet. Add your first one above!
              </div>
            )}
          </div>
        </div>
      </div>

      <Nav />
    </div>
  );
}
