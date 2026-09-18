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
        <h1 className="text-[3rem] font-bold text-[#4B2E28] leading-none mb-3 tracking-tight flex items-center gap-2">
          {user?.name?.split(' ')[0] || "There"}
          <span className="text-[2rem] font-normal" style={{ fontFamily: "var(--font-caveat), cursive" }}>♡</span>
        </h1>
        
        <p className="text-[1.1rem] text-[#5F4D4A] leading-[1.3]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}>
          Your memories<br/>
          are little pieces<br/>
          of happiness ♡
        </p>
        
        {/* Underline doodle */}
        <svg width="80" height="10" viewBox="0 0 100 10" fill="none" className="mt-2 opacity-60">
          <path d="M5,5 Q50,10 95,2" stroke="#4B2E28" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Small scattered hearts/stars near text */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute top-16 right-32 opacity-70">
           <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#4B2E28" strokeWidth="1.5" />
        </svg>
      </header>

      {/* ── TODAY's MEMORY ── */}
      {featuredMemory && (
        <div className="px-5 mt-2 relative z-10">
          <div className="relative bg-[#F5E9E0]/90 backdrop-blur-md rounded-[24px] p-4 shadow-sm border border-[#E8D5C8]">
            
            {/* Tape Label */}
            <div 
              className="absolute -top-3 left-6 px-3 py-1 shadow-sm rotate-[-3deg]"
              style={{ backgroundColor: "#F5E9E0", color: "#4B2E28", border: "1px solid #E8D5C8" }}
            >
              <span className="text-[14px] font-bold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Today's Memory ♡
              </span>
            </div>

            <div className="flex gap-4 mt-3">
              {/* Image */}
              <div className="w-[130px] h-[130px] shrink-0 rounded-[16px] overflow-hidden relative shadow-sm bg-[#F5E9E0]">
                {featuredMemory.mediaUrl ? (
                  <img src={featuredMemory.mediaUrl} alt={featuredMemory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {featuredMemory.type === "text" ? "📝" : "🎙️"}
                  </div>
                )}
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                   </svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 py-1 relative">
                <button className="absolute -top-1 right-0 text-[#4B2E28] opacity-70">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                   </svg>
                </button>
                <h3 className="text-[1.6rem] text-[#4B2E28] font-bold leading-tight mb-2 pr-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {featuredMemory.title} ♡
                </h3>
                <p className="text-[#5F4D4A] text-[15px] leading-[1.2] line-clamp-3 mb-3" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {featuredMemory.description || "A special moment saved forever."}
                </p>
                <div className="flex items-center gap-1.5 text-[#5F4D4A] text-[12px] font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDateDisplay(featuredMemory.date)}
                </div>
              </div>
            </div>
            
            {/* Doodles bottom right */}
            <div className="absolute -bottom-2 right-4 text-[#4B2E28] opacity-60 flex gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEMORY BUTTON ── */}
      <div className="px-5 mt-6 relative z-10">
        <Link
          href="/memories/new"
          className="w-full rounded-[30px] flex items-center justify-between p-4 shadow-md transition-transform active:scale-[0.98] relative"
          style={{ backgroundColor: "#4B2E28" }}
        >
          <div className="flex items-center gap-4">
            {/* Camera Icon */}
            <div className="relative text-white ml-2">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="7" width="18" height="14" rx="3" ry="3"></rect>
                <circle cx="12" cy="14" r="3"></circle>
                <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path>
              </svg>
              {/* Sparkles */}
              <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute -top-2 -right-3 text-white/80">
                <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
              </svg>
            </div>
            
            <div className="text-white">
              <h3 className="text-[1.4rem] font-medium leading-none mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>Add Memory</h3>
              <p className="text-[11px] opacity-90 tracking-wide font-medium" style={{ fontFamily: "monospace" }}>Capture a moment, keep it forever ♡</p>
            </div>
          </div>
          
          <div className="text-white opacity-80 mr-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </Link>
        
        {/* Floating heart below button */}
        <div className="absolute -bottom-3 right-8 text-[#4B2E28] opacity-70">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </div>
      </div>

      {/* ── RECENT MEMORIES (LIST) ── */}
      <div className="mt-8 px-5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#4B2E28" stroke="#4B2E28" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2 className="text-[1.6rem] text-[#4B2E28] font-bold leading-none" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              Recent Memories
            </h2>
          </div>
          <Link href="/gallery" className="text-[#4B2E28] text-[12px] font-semibold flex items-center gap-1 hover:opacity-70" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "16px" }}>
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {recentMemories.map(memory => (
            <Link 
              href={`/memories/${memory.id}/edit`} 
              key={memory.id}
              className="bg-[#F5E9E0]/90 backdrop-blur-sm rounded-[20px] p-2 flex items-center gap-4 shadow-sm border border-[#E8D5C8] relative overflow-hidden"
            >
              {/* Image Thumbnail with tape */}
              <div className="w-[70px] h-[70px] shrink-0 rounded-[14px] overflow-hidden bg-[#F5E9E0] relative ml-1">
                 <div className="absolute -top-2 -left-2 w-8 h-4 bg-[#F5E9E0] rotate-[-25deg] z-10 shadow-sm opacity-80 border border-[#E8D5C8]"></div>
                {memory.mediaUrl ? (
                  <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "📷"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 py-1 pr-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-[#4B2E28] text-[1.2rem]" style={{ fontFamily: "var(--font-caveat), cursive" }}>{memory.title} ♡</h3>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
                
                <div className="flex items-center gap-2 text-[#5F4D4A] text-[11px] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatDateDisplay(memory.date)}
                </div>
              </div>

              {/* Right side floating heart */}
              <div className="absolute right-4 bottom-2 text-[#4B2E28] opacity-60">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
