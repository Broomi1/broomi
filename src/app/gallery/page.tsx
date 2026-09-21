"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [slideshowContext, setSlideshowContext] = useState<Memory[] | null>(null);

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
          if (Array.isArray(data)) {
            setMemories(data);
          } else {
            console.error("API returned non-array:", data);
            setMemories([]);
          }
          setLoading(false);
        });
    }
  }, [status]);

  const memoriesByMonth = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    memories.forEach(m => {
      const d = new Date(m.date || m.createdAt);
      if (isNaN(d.getTime())) return; // Prevents "Invalid time value" crashes
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return Object.entries(groups).map(([key, mems]) => {
      const [year, month] = key.split('-');
      const d = new Date(parseInt(year), parseInt(month) - 1, 1);
      let label = "Unknown";
      try {
        label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      } catch (e) {
        // Fallback if formatting fails
        label = key;
      }
      return { label, key, memories: mems };
    }).sort((a, b) => b.key.localeCompare(a.key)); // newest first
  }, [memories]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E3E9F0" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredMemories = filter === "all" ? memories : memories.filter(m => m.type === filter);
  const activeMemories = slideshowContext || filteredMemories;

  {/* ── SLIDESHOW OVERLAY ── */}
  return (
    <div className="min-h-screen pb-36 font-sans relative">
      
      {/* ── BACKGROUND IMAGE (Fixed) ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/gallery-new-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Subtle overlay for readability */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* ── HEADER ── */}
      <header className="pt-16 px-5 pb-4 relative z-10">
        <h1 className="text-[3rem] font-bold text-[#4B2E28] leading-none mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Gallery ♡
        </h1>
        <p className="text-[1.1rem] text-[#7A6058] drop-shadow-sm font-semibold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          All your captured moments
        </p>
      </header>

      {/* ── FILTER TABS ── */}
      <div className="px-5 mt-2 mb-6 relative z-10">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
          <FilterTab 
            active={filter === "all"} 
            onClick={() => setFilter("all")} 
            label="All" 
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill={filter==="all"?"white":"#4B2E28"}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>} 
          />
          <FilterTab 
            active={filter === "photo"} 
            onClick={() => setFilter("photo")} 
            label="Photo" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="photo"?"white":"#4B2E28"} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>} 
          />
          <FilterTab 
            active={filter === "video"} 
            onClick={() => setFilter("video")} 
            label="Video" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="video"?"white":"#4B2E28"} strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>} 
          />
          <FilterTab 
            active={filter === "voice"} 
            onClick={() => setFilter("voice")} 
            label="Voice" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="voice"?"white":"#4B2E28"} strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>} 
          />
          <FilterTab 
            active={filter === "text"} 
            onClick={() => setFilter("text")} 
            label="Text" 
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={filter==="text"?"white":"#4B2E28"} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} 
          />
        </div>
      </div>

      {/* ── SLIDESHOW OVERLAY ── */}
      {slideshowIndex !== null && activeMemories[slideshowIndex] && (
        <div className="fixed inset-0 z-[100] bg-[#1a1514]/95 backdrop-blur-lg flex flex-col items-center justify-center">
          {/* Top Bar */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
            <button 
              onClick={() => { setSlideshowIndex(null); setSlideshowContext(null); }} 
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Link 
              href={`/memories/${activeMemories[slideshowIndex].id}`}
              className="text-white/90 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full font-semibold backdrop-blur-md transition-all active:scale-95 text-sm tracking-wide"
            >
              Details & Edit
            </Link>
          </div>

          {/* Media Container (Click to advance) */}
          <div 
            className="w-full h-[65vh] flex flex-col items-center justify-center px-4 cursor-pointer"
            onClick={() => {
              if (slideshowIndex < activeMemories.length - 1) {
                setSlideshowIndex(slideshowIndex + 1);
              } else {
                setSlideshowIndex(null);
                setSlideshowContext(null);
              }
            }}
          >
            {activeMemories[slideshowIndex].mediaUrl ? (
              activeMemories[slideshowIndex].type === "video" ? (
                <video src={activeMemories[slideshowIndex].mediaUrl!} autoPlay controls className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
              ) : (
                <img src={activeMemories[slideshowIndex].mediaUrl!} alt="memory" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl drop-shadow-2xl select-none" />
              )
            ) : (
              <div className="text-8xl md:text-9xl drop-shadow-2xl">
                {activeMemories[slideshowIndex].type === "text" ? "📝" : activeMemories[slideshowIndex].type === "voice" ? "🎙️" : "✨"}
              </div>
            )}
            
            {/* Title display in slideshow */}
            <h2 className="text-white/90 text-3xl mt-6 font-medium text-center px-4 drop-shadow-md" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              {activeMemories[slideshowIndex].title}
            </h2>
          </div>

          {/* Bottom Progress */}
          <div className="absolute bottom-12 text-white/50 text-sm font-medium tracking-widest uppercase flex flex-col items-center gap-2">
            <span>Tap image to continue</span>
            <span>{slideshowIndex + 1} / {activeMemories.length}</span>
          </div>
        </div>
      )}

      {/* ── MONTHLY STORIES ── */}
      {memoriesByMonth.length > 0 && (
        <div className="mb-5 relative z-10">
          <p className="px-5 mb-3 text-[1rem] font-semibold text-[#4B2E28] drop-shadow-sm" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem" }}>
            Monthly Stories
          </p>
          <div className="flex gap-4 px-5 overflow-x-auto hide-scrollbar pb-1">
            {memoriesByMonth.map((group) => {
              const firstMediaMemory = group.memories.find(m => m.mediaUrl) || group.memories[0];
              return (
                <div
                  key={group.key}
                  onClick={() => { 
                    setSlideshowContext(group.memories);
                    setSlideshowIndex(0); 
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  {/* Story circle */}
                  <div
                    className="rounded-full p-[3px] shrink-0 shadow-sm transition-transform group-active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #4B2E28, #E8B89A, #8A5A44)",
                      width: 72,
                      height: 72,
                    }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden border-[2.5px] border-[#F5EFE8] bg-[#EDE6DC]">
                      {firstMediaMemory?.mediaUrl && firstMediaMemory?.type !== "voice" ? (
                        firstMediaMemory.type === "video" ? (
                          <video src={firstMediaMemory.mediaUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={firstMediaMemory.mediaUrl} alt={firstMediaMemory.title} className="w-full h-full object-cover" draggable={false} />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {firstMediaMemory?.type === "text" ? "📝" : firstMediaMemory?.type === "voice" ? "🎙️" : "✨"}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Label */}
                  <span
                    className="text-[#4B2E28] text-center leading-tight line-clamp-1 max-w-[70px] drop-shadow-sm bg-white/40 px-1.5 rounded"
                    style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    {group.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Divider */}
          <div className="mt-4 mx-5 h-[1px] bg-[#4B2E28] opacity-20" />
        </div>
      )}

      {/* ── PHOTO GRID (3 columns) ── */}
      <div className="grid grid-cols-3 gap-[2px] pb-28 relative z-10 px-[2px]">
        {filteredMemories.map((memory, index) => (
          <div
            key={memory.id}
            onClick={() => { setSlideshowContext(null); setSlideshowIndex(index); }}
            className="relative overflow-hidden cursor-pointer active:opacity-75 transition-opacity"
            style={{ aspectRatio: "1/1" }}
          >
            {memory.mediaUrl ? (
              memory.type === "video" ? (
                <video src={memory.mediaUrl} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={memory.mediaUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: index % 3 === 0 ? "#EDE6DC" : index % 3 === 1 ? "#E8DDD3" : "#E3D8CE" }}
              >
                {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "✨"}
              </div>
            )}
            {/* Video indicator */}
            {memory.type === "video" && (
              <div className="absolute top-1.5 right-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-24 text-[#4B2E28] relative z-10 drop-shadow-sm font-semibold" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.4rem" }}>
          No memories yet ♡
        </div>
      )}

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Nav />
    </div>
  );
}

function FilterTab({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`snap-start flex items-center gap-2 px-5 py-2.5 rounded-full transition-all shrink-0 border shadow-sm ${
        active
          ? "bg-[#4B2E28] text-white border-[#4B2E28]"
          : "bg-[#F5E9E0]/90 text-[#4B2E28] border-[#E8D5C8]"
      }`}
    >
      {icon}
      <span className="text-[14px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
