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

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF6F0" }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  const current = memories[currentIndex];

  const handleTap = () => {
    if (memories.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  return (
    <div className="min-h-screen font-sans relative overflow-hidden">

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
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundColor: "rgba(255,255,255,0.45)", backdropFilter: "blur(2px)" }}
      />

      {/* ── HEADER ── */}
      <header className="pt-14 px-5 pb-3 relative z-10 flex justify-between items-end">
        <div>
          <h1
            className="text-[3rem] font-bold text-[#4B2E28] leading-none mb-0.5"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Gallery ♡
          </h1>
          <p className="text-[1rem] text-[#7A6058] font-semibold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            {memories.length} {memories.length === 1 ? "memory" : "memories"}
          </p>
        </div>

        {/* View All Button */}
        <Link
          href="/gallery/all"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4B2E28]/30 bg-white/60 backdrop-blur-md shadow-sm active:scale-95 transition-transform"
        >
          <span
            className="text-[#4B2E28] font-bold text-sm"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.1rem" }}
          >
            View All
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </header>

      {/* ── FEATURED PHOTO WINDOW ── */}
      <div className="relative z-10 px-5 mt-2">
        {memories.length === 0 ? (
          <div
            className="w-full rounded-[2rem] flex flex-col items-center justify-center bg-white/40 border border-white/60 shadow-lg"
            style={{ height: "65vh" }}
          >
            <span className="text-6xl mb-4">🌸</span>
            <p className="text-[#4B2E28] text-xl font-semibold" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              No memories yet
            </p>
            <Link
              href="/memories/new"
              className="mt-6 px-6 py-2.5 bg-[#4B2E28] text-white rounded-full text-base font-semibold active:scale-95 transition-transform"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              + Add your first memory
            </Link>
          </div>
        ) : current ? (
          <div
            className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer active:scale-[0.99] transition-transform border border-white/50"
            style={{ height: "52vh" }}
            onClick={handleTap}
          >
            {/* Media */}
            {current.mediaUrl ? (
              current.type === "video" ? (
                <video src={current.mediaUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={current.mediaUrl} alt={current.title} className="w-full h-full object-cover select-none" draggable={false} />
              )
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ backgroundColor: "#EDE6DC" }}
              >
                {current.type === "text" ? "📝" : current.type === "voice" ? "🎙️" : "✨"}
              </div>
            )}

            {/* Bottom title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#1a0f0d]/80 via-[#1a0f0d]/30 to-transparent pointer-events-none">
              <p className="text-white text-2xl font-medium drop-shadow-md" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                {current.title}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {new Date(current.date || current.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            {/* Tap hint */}
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 pointer-events-none">
              <span className="text-white/80 text-xs font-medium tracking-wider uppercase">Tap to next</span>
            </div>

            {/* Video indicator */}
            {current.type === "video" && (
              <div className="absolute top-4 left-4 bg-black/40 p-2 rounded-full backdrop-blur-md pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            )}
          </div>
        ) : null}

        {/* Dot indicators */}
        {memories.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {memories.slice(0, Math.min(memories.length, 10)).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === currentIndex ? 20 : 7,
                  height: 7,
                  backgroundColor: i === currentIndex ? "#4B2E28" : "rgba(75,46,40,0.3)",
                }}
              />
            ))}
            {memories.length > 10 && (
              <span className="text-[#4B2E28]/50 text-xs self-center ml-1">+{memories.length - 10}</span>
            )}
          </div>
        )}

        {/* Detail link */}
        {current && (
          <div className="flex justify-center mt-3">
            <Link
              href={`/memories/${current.id}`}
              className="text-[#4B2E28] text-sm font-semibold underline underline-offset-2 opacity-60 active:opacity-100"
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}
            >
              View details & edit →
            </Link>
          </div>
        )}
      </div>

      <Nav />

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
