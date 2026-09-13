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
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF8]">
        <div className="animate-spin w-8 h-8 border-4 border-[#3D2410] border-t-transparent rounded-full" />
      </div>
    );
  }

  const user = session?.user as any;
  const recentMemories = memories.slice(0, 5); // top 5 recent for vertical list
  const featuredMemories = memories.filter(m => m.mediaUrl).slice(0, 4); // top 4 with media for carousel

  return (
    <div
      className="min-h-screen pb-32"
      style={{
        backgroundImage: "url('/dashboard-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── HEADER ── */}
      <header className="pt-20 px-6 pb-4 relative z-10">
        <h1 
          className="text-[2.5rem] leading-[1.1] text-[#3D2410] tracking-tight relative inline-block"
          style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 700 }}
        >
          Hello,<br />
          Welcome back!
          <span 
            className="absolute -right-8 bottom-0" 
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.8rem" }}
          >
            ♡
          </span>
          <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
            <path d="M0,4 Q25,8 50,4 T100,4" stroke="#8B7055" strokeWidth="1.5" fill="none" />
          </svg>
        </h1>
        <p className="text-[11px] text-[#5C4532] mt-5 leading-relaxed font-medium uppercase tracking-[0.05em]" style={{ fontFamily: "monospace" }}>
          Memories are the little<br />
          pieces of happiness<br />
          we collect in life ♡
        </p>

        {/* Profile Circle */}
        <Link href="/profile" className="absolute top-16 right-6 w-10 h-10 rounded-full bg-[#F5ECE0] border border-[#DCD0C0] shadow-sm flex items-center justify-center text-[#8B7055]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </Link>
      </header>

      {/* ── ADD MEMORY BUTTON ── */}
      <div className="px-5 mt-2 relative z-10">
        <Link
          href="/memories/new"
          className="w-full h-16 rounded-full flex items-center justify-between px-6 shadow-md transition-all active:scale-[0.98] relative overflow-hidden"
          style={{ backgroundColor: "#4A3628" }}
        >
          {/* Sparkles left */}
          <span className="absolute left-4 top-4 text-[#C4A07A] opacity-50" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "18px" }}>✧</span>
          <span className="absolute left-8 bottom-3 text-[#C4A07A] opacity-30" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "14px" }}>+</span>
          
          <div className="flex-1 flex justify-center items-center gap-3">
            <span className="text-[#FDFBF8] text-2xl font-light leading-none relative" style={{ top: "-1px" }}>+</span>
            <span className="text-[#FDFBF8] text-[17px] font-medium tracking-wide" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.4rem" }}>Add a Memory</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#7A5C48] flex items-center justify-center text-[#FDFBF8]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </Link>
      </div>

      {/* ── STATS BAR ── */}
      <div className="px-5 mt-5 relative z-10">
        <div className="w-full bg-[#FCF8F2] border border-[#EBE3D5] shadow-sm rounded-[24px] py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3628" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <div>
              <div className="text-[#4A3628] font-bold text-[15px] leading-tight">{memories.length}</div>
              <div className="text-[#8B7055] text-[10px] uppercase tracking-wider font-semibold">Memories</div>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-[#EBE3D5]"></div>

          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3628" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <div className="text-[#4A3628] font-bold text-[15px] leading-tight">
                {memories.filter(m => new Date(m.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-[#8B7055] text-[10px] uppercase tracking-wider font-semibold">This week</div>
            </div>
          </div>

          <div className="text-[#8B7055]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "20px" }}>♡</div>
        </div>
      </div>

      {/* ── YOUR MEMORIES (CAROUSEL) ── */}
      {featuredMemories.length > 0 && (
        <div className="mt-8 relative z-10">
          <div className="px-6 flex items-end justify-between mb-4">
            <h2 className="text-[1.8rem] text-[#3D2410] font-bold leading-none relative inline-block" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              Your Memories
              <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                <path d="M0,2 Q25,4 50,2 T100,2" stroke="#8B7055" strokeWidth="1.5" fill="none" />
              </svg>
            </h2>
            <Link href="/gallery" className="text-[#8B7055] text-[12px] font-semibold flex items-center gap-1 hover:text-[#4A3628]">
              See all →
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x hide-scrollbar">
            {featuredMemories.map(memory => (
              <Link 
                href={`/memories/${memory.id}/edit`} 
                key={memory.id}
                className="relative shrink-0 w-[160px] h-[220px] rounded-[20px] overflow-hidden shadow-sm snap-start"
              >
                <img src={memory.mediaUrl!} alt={memory.title} className="w-full h-full object-cover" />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20"></div>
                
                {/* Top icons */}
                <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span className="text-white text-[10px] font-bold">1</span>
                </div>
                <div className="absolute top-3 right-3 text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-[14px] font-medium leading-tight line-clamp-2 mb-1" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.1rem" }}>
                    {memory.title} ♡
                  </h3>
                  <p className="text-[10px] text-white/80 font-medium tracking-wide text-right">
                    {formatDateDisplay(memory.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── RECENT MEMORIES (LIST) ── */}
      <div className="mt-4 px-5 relative z-10">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <h2 className="text-[1.8rem] text-[#3D2410] font-bold leading-none" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Recent Memories
          </h2>
          <span className="text-[#8B7055] text-lg mt-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>✨</span>
        </div>

        <div className="space-y-4">
          {recentMemories.map(memory => (
            <Link 
              href={`/memories/${memory.id}/edit`} 
              key={memory.id}
              className="bg-[#FCF8F2]/90 backdrop-blur-sm rounded-[24px] p-3 flex gap-4 shadow-sm border border-[#EBE3D5] items-center"
            >
              {/* Image Thumbnail */}
              <div className="w-[85px] h-[85px] shrink-0 rounded-[18px] overflow-hidden bg-[#F5ECE0]">
                {memory.mediaUrl ? (
                  <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[2rem]">
                    {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "📷"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-[#3D2410] text-[15px]">{memory.title}</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#8B7055">
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                
                <div className="flex items-center gap-2 text-[#8B7055] text-[11px] font-medium mb-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {formatFullDate(memory.date)}
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-1.5 text-[#8B7055] text-[11px] font-medium">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {memory.type === "photo" ? (
                        <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></>
                      ) : memory.type === "video" ? (
                        <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></>
                      ) : memory.type === "voice" ? (
                        <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></>
                      ) : (
                        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></>
                      )}
                    </svg>
                    {memory.type === "photo" ? "1 photo" : memory.type === "video" ? "1 video" : memory.type === "voice" ? "1 voice note" : "Written"}
                  </div>
                  
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B7055" strokeWidth="1.5" className="mb-0.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
          
          {recentMemories.length === 0 && (
            <div className="text-center py-10 text-[#8B7055]">
              No memories yet. Add your first one above!
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <Nav />
    </div>
  );
}
