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

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F3]">
        <div className="animate-spin w-8 h-8 border-4 border-[#3C2415] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredMemories = filter === "all" ? memories : memories.filter(m => m.type === filter);

  // Card pastel backgrounds
  const cardBgs = ["#FCEAEB", "#FDF0E1", "#EBF5ED", "#F3ECF7"];

  return (
    <div
      className="min-h-screen pb-36 font-sans"
      style={{
        backgroundImage: "url('/gallery-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── HEADER ── */}
      <header className="pt-24 px-6 pb-4 relative z-10">
        <h1 className="text-[3.2rem] font-bold text-[#3C2415] leading-none mb-1 tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Gallery
          <span className="text-[2rem] font-normal text-[#B97C7C]">♡</span>
        </h1>
        <p className="text-[1.3rem] text-[#7A665A]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}>
          All your captured moments ♡
        </p>
      </header>

      {/* ── FILTER TABS ── */}
      <div className="px-5 mt-2 mb-6 relative z-10">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          <FilterTab 
            active={filter === "all"} 
            onClick={() => setFilter("all")} 
            label="All" 
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill={filter==="all"?"white":"#8B6A5B"}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} 
          />
          <FilterTab 
            active={filter === "photo"} 
            onClick={() => setFilter("photo")} 
            label="Photo" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="photo"?"white":"#8B6A5B"} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>} 
          />
          <FilterTab 
            active={filter === "video"} 
            onClick={() => setFilter("video")} 
            label="Video" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="video"?"white":"#8B6A5B"} strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>} 
          />
          <FilterTab 
            active={filter === "voice"} 
            onClick={() => setFilter("voice")} 
            label="Voice" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="voice"?"white":"#8B6A5B"} strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>} 
          />
          <FilterTab 
            active={filter === "text"} 
            onClick={() => setFilter("text")} 
            label="Text" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="text"?"white":"#8B6A5B"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} 
          />
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="px-5 grid grid-cols-2 gap-4 relative z-10">
        {filteredMemories.map((memory, idx) => {
          const bg = cardBgs[idx % cardBgs.length];
          const rotate = idx % 2 === 0 ? "rotate-[-2deg]" : "rotate-[3deg]";
          return (
            <Link 
              href={`/memories/${memory.id}/edit`} 
              key={memory.id}
              className="rounded-[20px] p-3 flex flex-col gap-3 shadow-sm border border-black/5 relative overflow-hidden transition-transform active:scale-95"
              style={{ backgroundColor: bg }}
            >
              {/* Tape decoration on the card */}
              {idx % 2 === 0 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#EBA8B2]/50 border border-[#EBA8B2]/20 rotate-[-5deg] z-20 shadow-sm" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)" }}></div>
              )}
              {idx % 2 !== 0 && (
                <div className="absolute top-1 right-2 w-10 h-3 bg-[#DDC7AB] rotate-[15deg] z-20 shadow-sm opacity-90"></div>
              )}
              
              {/* Polaroid Image */}
              <div className={`bg-white p-2 pb-6 shadow-md ${rotate} rounded-sm mt-2 relative z-10 flex-shrink-0`}>
                <div className="w-full aspect-square bg-[#F5ECE0] overflow-hidden rounded-sm relative">
                  {memory.mediaUrl ? (
                    <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {memory.type === "text" ? "📝" : "🎙️"}
                    </div>
                  )}
                </div>
                {/* Hand-drawn heart on polaroid frame */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A66B6B" strokeWidth="2" className="absolute bottom-1 right-2 opacity-70">
                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>

              {/* Info Box */}
              <div className="bg-[#FCF8F5]/90 rounded-xl p-3 flex-1 flex flex-col justify-between shadow-sm relative z-10 border border-[#F0E6DF]">
                <div>
                  <h3 className="font-bold text-[#3C2415] text-[1.4rem] leading-none mb-1 line-clamp-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>{memory.title}</h3>
                  <div className="text-[#8B6A5B] text-[10px] font-medium tracking-wide">
                    {formatDateDisplay(memory.date)}
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#EAD4D0]/60 flex items-center justify-center text-[#A66B6B]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Background doodles on the card itself */}
              {idx % 2 === 0 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B97C7C" strokeWidth="1.5" className="absolute bottom-2 left-2 opacity-50 z-0"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" stroke="#8B6A5B" strokeWidth="1.5" className="absolute bottom-1 right-8 opacity-40 z-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v6l4.25 2.5"/></svg>
              )}
            </Link>
          );
        })}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-20 text-[#8B6A5B] font-medium" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.4rem" }}>
          No memories found.
        </div>
      )}

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

function FilterTab({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`snap-start flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shrink-0 border shadow-sm ${
        active 
          ? "bg-[#B97C7C] text-white border-[#B97C7C]" 
          : "bg-[#FCF5F0] text-[#8B6A5B] border-[#E8D5C8]"
      }`}
    >
      {icon}
      <span className="text-[14px] font-medium tracking-wide">
        {label}
      </span>
    </button>
  );
}
