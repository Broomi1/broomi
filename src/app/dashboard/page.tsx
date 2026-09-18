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
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/memories")
        .then((res) => res.json())
        .then((data) => {
          setMemories(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/login-bg.jpg')", backgroundSize: "cover" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const user = session?.user as any;
  const recentMemories = memories.slice(0, 5);
  const featuredMemory = memories.find(m => m.mediaUrl) || memories[0];

  return (
    <div
      className="min-h-screen pb-40 font-sans"
      style={{
        backgroundImage: "url('/login-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── HEADER ── */}
      <header className="pt-20 px-6 pb-6 relative z-10">
        <h2 className="text-[1.3rem] text-[#4B2E28] mb-[-4px]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 700 }}>
          Good to see you,
        </h2>
        <h1 className="text-[4rem] font-bold text-[#4B2E28] leading-none tracking-tight flex items-center gap-2 mb-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          {user?.name?.split(' ')[0] || "weblom"}
          <span className="text-[2.2rem] font-normal" style={{ fontFamily: "var(--font-caveat), cursive" }}>♡</span>
        </h1>
        
        <p className="text-[1.2rem] text-[#5F4D4A] leading-[1.3]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}>
          Your memories<br/>
          are little pieces<br/>
          of happiness ♡
        </p>

        {/* Small scattered hearts/stars near text */}
        <div className="absolute top-20 right-28 opacity-70">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="1.5">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
           </svg>
        </div>
        
        {/* Sticky Note */}
        <div className="absolute top-[220px] left-6 z-20" style={{ transform: "rotate(-4deg)" }}>
          {/* Tape strip at top */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-2 w-10 h-5 rounded-sm z-10"
            style={{ background: "rgba(200, 180, 160, 0.7)" }}
          />
          <div
            style={{
              background: "#F2E8D5",
              padding: "16px 16px 20px 16px",
              boxShadow: "2px 4px 10px rgba(0,0,0,0.15)",
              clipPath:
                "polygon(0% 4%,3% 0%,8% 2%,15% 0%,22% 3%,30% 0%,37% 2%,45% 0%,52% 3%,60% 1%,67% 3%,75% 0%,82% 2%,90% 0%,97% 2%,100% 0%,100% 95%,98% 98%,93% 96%,86% 99%,79% 97%,72% 100%,65% 97%,57% 99%,50% 96%,42% 100%,35% 97%,28% 99%,21% 96%,14% 100%,7% 97%,2% 99%,0% 96%)",
            }}
          >
            <p
              className="text-center leading-tight tracking-wide"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "16px",
                color: "#4B2E28",
                fontWeight: 600,
              }}
            >
              Small<br/>moments<br/>Big<br/>memories<br/>♡
            </p>
          </div>
        </div>
      </header>

      {/* Adding space for sticky note */}
      <div style={{ height: "70px" }} />

      {/* ── TODAY's MEMORY ── */}
      {featuredMemory && (
        <div className="px-5 mt-4 relative z-10">
          <div className="relative bg-[#FAF6F2]/95 backdrop-blur-md rounded-[28px] p-5 shadow-sm border border-[#E8D5C8]">
            
            {/* Tape Label */}
            <div 
              className="absolute -top-3 left-6 px-4 py-1 shadow-sm rotate-[-3deg] border border-[#E8D5C8] rounded-sm"
              style={{ backgroundColor: "#F5E9E0", color: "#4B2E28" }}
            >
              <span className="text-[15px] font-bold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Today's Memory ♡
              </span>
            </div>
            
            {/* 3 dots icon top right */}
            <div className="absolute top-4 right-4 text-[#4B2E28]">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                 <circle cx="12" cy="5" r="2"></circle>
                 <circle cx="12" cy="12" r="2"></circle>
                 <circle cx="12" cy="19" r="2"></circle>
               </svg>
            </div>

            <div className="flex gap-4 mt-4">
              {/* Image */}
              <div className="w-[120px] h-[120px] shrink-0 rounded-[20px] overflow-hidden relative shadow-sm bg-[#F5E9E0]">
                {featuredMemory.mediaUrl ? (
                  <img src={featuredMemory.mediaUrl} alt={featuredMemory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {featuredMemory.type === "text" ? "📝" : "🎙️"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 py-1 flex flex-col justify-center">
                <h3 className="text-[2.2rem] text-[#4B2E28] font-bold leading-none mb-1 pr-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {featuredMemory.title} ♡
                </h3>
                <p className="text-[#5F4D4A] text-[15px] leading-[1.2] line-clamp-2 mb-3" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {featuredMemory.description || "Special day"}
                </p>
                <div className="flex items-center gap-2 text-[#4B2E28] text-[13px] font-semibold">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDateDisplay(featuredMemory.date)}
                </div>
              </div>
            </div>
            
            {/* Two little hearts bottom right, outside */}
            <div className="absolute -bottom-4 right-4 text-[#4B2E28] opacity-70 flex items-end gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEMORY BUTTON ── */}
      <div className="px-5 mt-10 relative z-10">
        <Link
          href="/memories/new"
          className="w-full rounded-[36px] flex items-center justify-between py-5 px-6 shadow-md transition-transform active:scale-[0.98] relative"
          style={{ backgroundColor: "#4B2E28" }}
        >
          <div className="flex items-center gap-4">
            {/* Camera Icon */}
            <div className="relative text-white flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              {/* Sparkles */}
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute -top-3 -right-3 text-white/90">
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            </div>
            
            <div className="text-white ml-2">
              <h3 className="text-[1.6rem] font-medium leading-none mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>Add Memory</h3>
              <p className="text-[12px] opacity-90 tracking-wide font-medium" style={{ fontFamily: "monospace" }}>Capture a moment, keep it forever ♡</p>
            </div>
          </div>
          
          <div className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </Link>
      </div>

      {/* ── RECENT MEMORIES (LIST) ── */}
      <div className="mt-8 px-5 relative z-10">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#4B2E28" stroke="#4B2E28" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-[1.8rem] text-[#4B2E28] font-bold leading-none" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              Recent Memories
            </h2>
          </div>
          <Link href="/gallery" className="text-[#4B2E28] text-[1.2rem] font-semibold flex items-center gap-1 hover:opacity-70" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {recentMemories.map(memory => (
            <Link 
              href={`/memories/${memory.id}/edit`} 
              key={memory.id}
              className="bg-[#FAF6F2]/95 backdrop-blur-sm rounded-[24px] p-2.5 flex items-center gap-4 shadow-sm border border-[#E8D5C8] relative overflow-hidden"
            >
              {/* Image Thumbnail */}
              <div className="w-[75px] h-[75px] shrink-0 rounded-[18px] overflow-hidden bg-[#F5E9E0] relative ml-1 border border-[#E8D5C8]/30">
                {memory.mediaUrl ? (
                  <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "📷"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 py-1 pr-6 flex flex-col justify-center">
                <h3 className="font-bold text-[#4B2E28] text-[1.4rem] mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {memory.title} ♡
                </h3>
                <div className="flex items-center gap-1.5 text-[#5F4D4A] text-[12px] font-semibold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatDateDisplay(memory.date)}
                </div>
              </div>

              {/* Right side floating icons */}
              <div className="absolute right-4 top-4 text-[#5F4D4A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="absolute right-4 bottom-3 text-[#5F4D4A]">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                 </svg>
              </div>
            </Link>
          ))}
          
          {recentMemories.length === 0 && (
            <div className="text-center py-10 text-[#5F4D4A] font-medium" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem" }}>
              No memories yet. Add your first one above!
            </div>
          )}
        </div>
      </div>

      <Nav />
    </div>
  );
}
