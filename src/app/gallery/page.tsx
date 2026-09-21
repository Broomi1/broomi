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
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#E3E9F0" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredMemories = filter === "all" ? memories : memories.filter(m => m.type === filter);

  // Card pastel backgrounds — cream tones matching login
  const cardBgs = ["#F5E9E0", "#EDE6DC", "#F0E8DE", "#EBE2D8"];

  return (
    <div className="min-h-screen pb-36 font-sans relative" style={{ backgroundColor: "#E3E9F0" }}>
      {/* Ultra-stable fixed background for mobile */}
      <div 
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/gallery-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />
      {/* ── HEADER ── */}
      <header className="pt-24 px-6 pb-4 relative z-10">
        <h1 className="text-[3.2rem] font-bold text-[#4B2E28] leading-none mb-1 tracking-tight flex items-center gap-2" style={{ fontFamily: "var(--font-caveat), cursive" }}>
          Gallery
          <span className="text-[2rem] font-normal text-[#4B2E28]">♡</span>
        </h1>
        <p className="text-[1.3rem] text-[#5F4D4A]" style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 600 }}>
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
      {slideshowIndex !== null && filteredMemories[slideshowIndex] && (
        <div className="fixed inset-0 z-[100] bg-[#1a1514]/95 backdrop-blur-lg flex flex-col items-center justify-center">
          {/* Top Bar */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
            <button 
              onClick={() => setSlideshowIndex(null)} 
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <Link 
              href={`/memories/${filteredMemories[slideshowIndex].id}`}
              className="text-white/90 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full font-semibold backdrop-blur-md transition-all active:scale-95 text-sm tracking-wide"
            >
              Details & Edit
            </Link>
          </div>

          {/* Media Container (Click to advance) */}
          <div 
            className="w-full h-[65vh] flex flex-col items-center justify-center px-4 cursor-pointer"
            onClick={() => {
              if (slideshowIndex < filteredMemories.length - 1) {
                setSlideshowIndex(slideshowIndex + 1);
              } else {
                setSlideshowIndex(null);
              }
            }}
          >
            {filteredMemories[slideshowIndex].mediaUrl ? (
              filteredMemories[slideshowIndex].type === "video" ? (
                <video src={filteredMemories[slideshowIndex].mediaUrl!} autoPlay controls className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10" />
              ) : (
                <img src={filteredMemories[slideshowIndex].mediaUrl!} alt="memory" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl drop-shadow-2xl select-none" />
              )
            ) : (
              <div className="text-8xl md:text-9xl drop-shadow-2xl">
                {filteredMemories[slideshowIndex].type === "text" ? "📝" : filteredMemories[slideshowIndex].type === "voice" ? "🎙️" : "✨"}
              </div>
            )}
            
            {/* Title display in slideshow */}
            <h2 className="text-white/90 text-3xl mt-6 font-medium text-center px-4 drop-shadow-md" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              {filteredMemories[slideshowIndex].title}
            </h2>
          </div>

          {/* Bottom Progress */}
          <div className="absolute bottom-12 text-white/50 text-sm font-medium tracking-widest uppercase flex flex-col items-center gap-2">
            <span>Tap image to continue</span>
            <span>{slideshowIndex + 1} / {filteredMemories.length}</span>
          </div>
        </div>
      )}

      {/* ── POLAROID WALL ── */}
      <div className="px-4 relative z-10 pb-28">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20 text-[#5F4D4A]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.5rem" }}>
            No memories yet ♡<br />
            <span className="text-base opacity-60">Start by adding one!</span>
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            {/* Left column — offset down */}
            <div className="flex-1 flex flex-col gap-6 mt-10">
              {filteredMemories
                .filter((_, i) => i % 2 === 0)
                .map((memory, i) => (
                  <PolaroidCard
                    key={memory.id}
                    memory={memory}
                    rotation={polaroidRotations[(i * 2) % polaroidRotations.length]}
                    onClick={() => setSlideshowIndex(i * 2)}
                  />
                ))}
            </div>
            {/* Right column — starts at top */}
            <div className="flex-1 flex flex-col gap-6 mt-0">
              {filteredMemories
                .filter((_, i) => i % 2 === 1)
                .map((memory, i) => (
                  <PolaroidCard
                    key={memory.id}
                    memory={memory}
                    rotation={polaroidRotations[(i * 2 + 1) % polaroidRotations.length]}
                    onClick={() => setSlideshowIndex(i * 2 + 1)}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Nav />
    </div>
  );
}

const polaroidRotations = [-4, 3, -2.5, 5, -3.5, 2, -5, 4, -1.5, 3.5, -4.5, 2.5];

function PolaroidCard({
  memory,
  rotation,
  onClick,
}: {
  memory: { id: string; title: string; type: string; mediaUrl: string | null; date: string };
  rotation: number;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer active:scale-[0.96] transition-all duration-200 select-none"
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "center center" }}
    >
      <div
        className="relative shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        style={{
          background: "#FEFCF8",
          padding: "10px 10px 52px 10px",
          borderRadius: "4px",
        }}
      >
        {/* Photo area */}
        <div className="w-full overflow-hidden" style={{ aspectRatio: "1/1", background: "#F0E8DE" }}>
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
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "✨"}
            </div>
          )}
        </div>

        {/* Handwritten caption */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-3 pt-2">
          <p
            className="text-[#4B2E28] font-bold text-center line-clamp-1 px-2 leading-tight"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.05rem" }}
          >
            {memory.title}
          </p>
          <p
            className="text-[#9B8B80] text-center"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "0.78rem" }}
          >
            {formatDateDisplay(memory.date)}
          </p>
        </div>

        {/* Subtle tape strip at top */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 opacity-60"
          style={{
            background: "rgba(240, 228, 210, 0.85)",
            borderRadius: "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
      </div>
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
