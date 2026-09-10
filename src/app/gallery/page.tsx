"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

interface Memory {
  id: string;
  title: string;
  type: string;
  mediaUrl: string | null;
  date: string;
}

export default function GalleryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
        <h1 className="text-3xl font-medium text-stone-800">Gallery</h1>
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
              <div key={m.id} className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                {m.mediaUrl && m.type === "photo" ? (
                  <img src={m.mediaUrl} alt={m.title} className="w-full h-32 object-cover" />
                ) : m.mediaUrl && m.type === "video" ? (
                  <video src={m.mediaUrl} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-amber-50 flex items-center justify-center text-4xl">
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
    </div>
  );
}
