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

      {/* ── GRID ── */}
      <div className="px-5 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 relative z-10 pb-10">
        {filteredMemories.map((memory) => {
          return (
            <Link 
              href={`/memories/${memory.id}`} 
              key={memory.id}
              className="relative overflow-hidden rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all active:scale-[0.98] bg-[#F5E9E0]/30 border border-white/50 backdrop-blur-sm group"
            >
              <div className="w-full aspect-[4/5] relative flex items-center justify-center">
                {memory.mediaUrl ? (
                  memory.type === "video" ? (
                    <video src={memory.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )
                ) : (
                  <div className="text-6xl drop-shadow-sm">
                    {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "✨"}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-20 text-[#5F4D4A] font-medium" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.4rem" }}>
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
          ? "bg-[#4B2E28] text-white border-[#4B2E28]" 
          : "bg-[#F5E9E0]/90 text-[#4B2E28] border-[#E8D5C8]"
      }`}
    >
      {icon}
      <span className="text-[14px] font-medium tracking-wide">
        {label}
      </span>
    </button>
  );
}
