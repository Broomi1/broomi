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

export default function GalleryAllPage() {
  const { status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [slideshowContext, setSlideshowContext] = useState<Memory[] | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/memories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setMemories(data);
          else setMemories([]);
          setLoading(false);
        });
    }
  }, [status]);

  const memoriesByMonth = useMemo(() => {
    const groups: Record<string, Memory[]> = {};
    memories.forEach((m) => {
      const d = new Date(m.date || m.createdAt);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return Object.entries(groups)
      .map(([key, mems]) => {
        const [year, month] = key.split("-");
        const d = new Date(parseInt(year), parseInt(month) - 1, 1);
        let label = key;
        try { label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" }); } catch {}
        return { label, key, memories: mems };
      })
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [memories]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF6F0" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredMemories = filter === "all" ? memories : memories.filter((m) => m.type === filter);
  const activeMemories = slideshowContext || filteredMemories;

  return (
    <div className="min-h-screen font-sans relative pb-32">

      {/* ── BACKGROUND ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/gallery-new-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundColor: "rgba(255,255,255,0.52)", backdropFilter: "blur(2px)" }}
      />

      {/* ── FULLSCREEN SLIDESHOW ── */}
      {slideshowIndex !== null && activeMemories[slideshowIndex] && (
        <div className="fixed inset-0 z-[100] bg-[#1a1514]/95 backdrop-blur-lg flex flex-col items-center justify-center">
          <div className="absolute top-0 w-full p-5 flex justify-between items-center z-50">
            <button
              onClick={() => { setSlideshowIndex(null); setSlideshowContext(null); }}
              className="text-white/80 bg-white/10 p-3 rounded-full backdrop-blur-md active:scale-95 transition-all"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <Link
              href={`/memories/${activeMemories[slideshowIndex].id}`}
              className="text-white/90 bg-white/10 px-5 py-2 rounded-full font-semibold backdrop-blur-md active:scale-95 text-sm"
            >
              Details & Edit
            </Link>
          </div>

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
                <video src={activeMemories[slideshowIndex].mediaUrl!} autoPlay controls className="max-w-full max-h-full rounded-2xl shadow-2xl" />
              ) : (
                <img src={activeMemories[slideshowIndex].mediaUrl!} alt="memory" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none" />
              )
            ) : (
              <div className="text-8xl">
                {activeMemories[slideshowIndex].type === "text" ? "📝" : activeMemories[slideshowIndex].type === "voice" ? "🎙️" : "✨"}
              </div>
            )}
            <h2 className="text-white/90 text-3xl mt-5 font-medium text-center px-4" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              {activeMemories[slideshowIndex].title}
            </h2>
          </div>

          <div className="absolute bottom-10 text-white/50 text-sm tracking-widest uppercase flex flex-col items-center gap-1">
            <span>Tap to continue</span>
            <span>{slideshowIndex + 1} / {activeMemories.length}</span>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <header className="pt-14 px-5 pb-3 relative z-10 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-full bg-white/60 border border-[#4B2E28]/20 backdrop-blur-md active:scale-95 transition-transform shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-[2.4rem] font-bold text-[#4B2E28] leading-none" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            All Memories
          </h1>
          <p className="text-[#7A6058] font-semibold text-sm" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            {memories.length} total
          </p>
        </div>
      </header>

      {/* ── FILTER TABS ── */}
      <div className="px-5 mt-1 mb-5 relative z-10">
        <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar snap-x">
          {[
            { key: "all", label: "All" },
            { key: "photo", label: "Photo" },
            { key: "video", label: "Video" },
            { key: "voice", label: "Voice" },
            { key: "text", label: "Text" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`snap-start px-5 py-2 rounded-full text-sm font-semibold shrink-0 border shadow-sm transition-all ${
                filter === tab.key
                  ? "bg-[#4B2E28] text-white border-[#4B2E28]"
                  : "bg-[#F5E9E0]/90 text-[#4B2E28] border-[#E8D5C8]"
              }`}
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MONTHLY STORIES ── */}
      {memoriesByMonth.length > 0 && (
        <div className="mb-5 relative z-10">
          <p className="px-5 mb-3 font-bold text-[#4B2E28]" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem" }}>
            Monthly Stories
          </p>
          <div className="flex gap-4 px-5 overflow-x-auto hide-scrollbar pb-2">
            {memoriesByMonth.map((group) => {
              const cover = group.memories.find((m) => m.mediaUrl) || group.memories[0];
              return (
                <div
                  key={group.key}
                  onClick={() => { setSlideshowContext(group.memories); setSlideshowIndex(0); }}
                  className="relative rounded-2xl overflow-hidden shadow-md shrink-0 cursor-pointer active:scale-95 transition-transform border-2 border-white/60 bg-[#EDE6DC]"
                  style={{ width: 100, height: 130 }}
                >
                  {cover?.mediaUrl && cover.type !== "voice" ? (
                    cover.type === "video" ? (
                      <video src={cover.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={cover.mediaUrl} alt={cover.title} className="w-full h-full object-cover" draggable={false} />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {cover?.type === "text" ? "📝" : cover?.type === "voice" ? "🎙️" : "✨"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E28]/75 via-transparent to-transparent pointer-events-none" />
                  <span
                    className="absolute bottom-2 left-0 right-0 text-white text-center text-sm drop-shadow px-1"
                    style={{ fontFamily: "var(--font-caveat), cursive" }}
                  >
                    {group.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 mx-5 h-px bg-[#4B2E28] opacity-15" />
        </div>
      )}

      {/* ── 4-COLUMN PHOTO GRID ── */}
      <div className="relative z-10 px-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20 text-[#4B2E28] font-semibold" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.3rem" }}>
            No memories yet ♡
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id}
                onClick={() => { setSlideshowContext(null); setSlideshowIndex(index); }}
                className="relative overflow-hidden rounded-lg cursor-pointer active:opacity-75 transition-opacity"
                style={{ aspectRatio: "1/1" }}
              >
                {memory.mediaUrl ? (
                  memory.type === "video" ? (
                    <video src={memory.mediaUrl} className="w-full h-full object-cover" />
                  ) : (
                    <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" draggable={false} />
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: index % 4 === 0 ? "#EDE6DC" : index % 4 === 1 ? "#E8DDD3" : index % 4 === 2 ? "#E3D8CE" : "#DDD3C9" }}
                  >
                    {memory.type === "text" ? "📝" : memory.type === "voice" ? "🎙️" : "✨"}
                  </div>
                )}
                {memory.type === "video" && (
                  <div className="absolute top-1 right-1 bg-black/40 p-1 rounded-full">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Nav />

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
