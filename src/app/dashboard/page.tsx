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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MemoryTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    photo: "📷",
    video: "🎥",
    voice: "🎙️",
    text: "✍️",
  };
  return <span className="text-base">{icons[type] || "📝"}</span>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      router.push("/admin");
    }
  }, [status, session, router]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f0e8" }}>
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-700 rounded-full" />
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div
      className="min-h-screen pb-28 font-sans"
      style={{
        backgroundImage: "url('/dashboard-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="pt-16 pb-6 px-6">
        <p className="text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-1">
          Your Space
        </p>
        <h1 className="text-[2.2rem] font-semibold text-black leading-tight flex items-center gap-2" style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>
          Hello, {user?.name}
          <span className="text-3xl inline-block drop-shadow-sm">👋</span>
        </h1>
        <p className="text-[#8B8276] text-sm mt-1">
          {memories.length} {memories.length === 1 ? "memory" : "memories"} collected
        </p>
      </header>

      {/* Add a Memory CTA */}
      <div className="px-6 mb-8 mt-1">
        <Link
          href="/memories/new"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white text-[15px] font-medium shadow-md transition-all active:scale-[0.98]"
          style={{ backgroundColor: "#222222" }}
        >
          <span className="text-xl font-light leading-none relative" style={{ top: "-1px" }}>+</span> Add a Memory
        </Link>
      </div>

      {/* Timeline */}
      <div className="px-6 relative">
        {memories.length === 0 ? (
          <div className="text-center py-20 space-y-3 relative z-10">
            <div className="text-5xl">🌿</div>
            <h3 className="text-lg font-medium text-stone-600" style={{ fontFamily: "Georgia, serif" }}>
              Your story starts here
            </h3>
            <p className="text-sm text-stone-400">Add your first memory to begin.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-4">Timeline</h2>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[8px] top-6 bottom-0 w-[1px] bg-[#D4CEC4]" />

              <div className="space-y-6">
                {memories.map((memory) => (
                  <div key={memory.id} className="relative pl-7">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E0B56A]" />
                    </div>
                    {/* Speech bubble pointer */}
                    <div className="absolute left-6 top-7 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#FDFBF8] border-b-[6px] border-b-transparent z-20" />

                    {/* Memory Card */}
                    <div 
                      className="bg-[#FDFBF8] rounded-[24px] overflow-hidden relative shadow-sm border border-[#EBE5DB]/50"
                    >
                      {/* Card Header */}
                      <div className="px-5 pt-5 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <MemoryTypeIcon type={memory.type} />
                            <h3 className="font-semibold text-black text-[15px]">
                              {memory.title}
                            </h3>
                          </div>
                          <span className="text-[13px] text-[#9A9A9A] shrink-0 font-medium">
                            {formatDate(memory.date)}
                          </span>
                        </div>
                        {memory.description && (
                          <p className="text-[15px] text-[#8B8276] mt-1">{memory.description}</p>
                        )}
                      </div>

                      {/* Media */}
                      {memory.mediaUrl && memory.type === "photo" && (
                        <div 
                          className="px-5 pb-2 cursor-pointer transition-transform active:scale-[0.99]" 
                          onClick={() => setSelectedMemory(memory)}
                        >
                          <img
                            src={memory.mediaUrl}
                            alt={memory.title}
                            className="w-full h-48 object-cover rounded-2xl border border-[#EBE5DB]/50"
                          />
                        </div>
                      )}
                      {memory.mediaUrl && memory.type === "video" && (
                        <div className="px-5 pb-2">
                          <video src={memory.mediaUrl} controls className="w-full h-48 object-cover rounded-2xl border border-[#EBE5DB]/50" />
                        </div>
                      )}
                      {memory.mediaUrl && memory.type === "voice" && (
                        <div className="px-5 pb-2">
                          <audio src={memory.mediaUrl} controls className="w-full" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="px-5 pb-5 pt-1 flex gap-4">
                        <Link
                          href={`/memories/${memory.id}/edit`}
                          className="text-[15px] font-medium transition-colors"
                          style={{ color: "#C37A5C" }}
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          id={memory.id}
                          onDelete={() => setMemories((m) => m.filter((x) => x.id !== memory.id))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Nav />

      {/* Photo Lightbox Modal */}
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
            {/* Full image */}
            {selectedMemory.mediaUrl && (
              <div className="relative">
                <img
                  src={selectedMemory.mediaUrl}
                  alt={selectedMemory.title}
                  className="w-full max-h-[60vh] object-contain bg-stone-900"
                />
                {/* Close button */}
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Details panel */}
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
                <button
                  onClick={() => {
                    if (selectedMemory.mediaUrl) {
                      window.open(selectedMemory.mediaUrl, "_blank");
                    }
                  }}
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
                >
                  🔗 Open Full
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteButton({ id, onDelete }: { id: string; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const handleDelete = async () => {
    await fetch(`/api/memories/${id}`, { method: "DELETE" });
    onDelete();
  };
  return confirming ? (
    <span className="text-[15px] flex gap-2">
      <button onClick={handleDelete} className="text-red-500 font-medium hover:text-red-700">
        Confirm
      </button>
      <button onClick={() => setConfirming(false)} className="text-[#9A9A9A] font-medium">
        Cancel
      </button>
    </span>
  ) : (
    <button
      onClick={() => setConfirming(true)}
      className="text-[15px] text-[#9A9A9A] font-medium transition-colors"
    >
      Delete
    </button>
  );
}
