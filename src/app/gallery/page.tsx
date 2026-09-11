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
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MemoryTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = { photo: "📷", video: "🎥", voice: "🎙️", text: "✍️" };
  return <span className="text-base">{icons[type] || "📝"}</span>;
}

export default function GalleryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/memories")
        .then((r) => r.json())
        .then((data) => {
          setMemories(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
      </div>
    );
  }

  const filters = ["all", "photo", "video", "voice", "text"];
  const filtered = filter === "all" ? memories : memories.filter((m) => m.type === filter);
  const mediaMemories = filtered.filter((m) => m.mediaUrl || m.type === "text");

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="pt-12 pb-4 px-6 bg-gradient-to-b from-amber-50 to-stone-50">
        <h1 className="text-3xl font-medium text-stone-800" style={{ fontFamily: "Georgia, serif" }}>Gallery</h1>
        <p className="text-stone-500 text-sm mt-1">All your captured moments</p>
      </header>

      {/* Filters */}
      <div className="px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium capitalize border transition-all ${
              filter === f
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-6 mt-2">
        {mediaMemories.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">📭</div>
            <h3 className="text-lg font-medium text-stone-600">Nothing here yet</h3>
            <p className="text-sm text-stone-400">Add memories to fill your gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {mediaMemories.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all active:scale-[0.97] cursor-pointer"
                onClick={() => setSelectedMemory(m)}
              >
                {m.mediaUrl && m.type === "photo" ? (
                  <img src={m.mediaUrl} alt={m.title} className="w-full h-36 object-cover" />
                ) : m.mediaUrl && m.type === "video" ? (
                  <video src={m.mediaUrl} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-amber-50 flex items-center justify-center text-4xl">
                    {m.type === "voice" ? "🎙️" : m.type === "text" ? "✍️" : "📝"}
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs font-medium text-stone-700 truncate">{m.title}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Nav />

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden w-full max-w-[420px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full media */}
            {selectedMemory.mediaUrl && selectedMemory.type === "photo" && (
              <div className="relative">
                <img
                  src={selectedMemory.mediaUrl}
                  alt={selectedMemory.title}
                  className="w-full max-h-[60vh] object-contain bg-stone-900"
                />
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedMemory.mediaUrl && selectedMemory.type === "video" && (
              <div className="relative">
                <video src={selectedMemory.mediaUrl} controls className="w-full max-h-[60vh] bg-stone-900" />
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedMemory.type === "voice" && selectedMemory.mediaUrl && (
              <div className="bg-amber-50 p-6 flex flex-col items-center gap-4 relative">
                <div className="text-5xl">🎙️</div>
                <audio src={selectedMemory.mediaUrl} controls className="w-full" />
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/20 text-stone-600 flex items-center justify-center text-lg hover:bg-black/30 transition"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedMemory.type === "text" && (
              <div className="bg-amber-50 p-6 flex flex-col items-center gap-2 relative min-h-[120px] justify-center">
                <div className="text-5xl">✍️</div>
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/20 text-stone-600 flex items-center justify-center text-lg hover:bg-black/30 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Details */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <MemoryTypeIcon type={selectedMemory.type} />
                <h2 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "Georgia, serif" }}>
                  {selectedMemory.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
                <span>📅</span>
                <span>{formatDate(selectedMemory.date)}</span>
              </div>

              {selectedMemory.description && (
                <p className="text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                  {selectedMemory.description}
                </p>
              )}

              <div className="flex gap-3 pt-2 border-t border-stone-100">
                <Link
                  href={`/memories/${selectedMemory.id}/edit`}
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition"
                  onClick={() => setSelectedMemory(null)}
                >
                  ✏️ Edit
                </Link>
                {selectedMemory.mediaUrl && (
                  <button
                    onClick={() => window.open(selectedMemory.mediaUrl!, "_blank")}
                    className="flex-1 py-2.5 text-center text-sm font-semibold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
                  >
                    🔗 Open Full
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
