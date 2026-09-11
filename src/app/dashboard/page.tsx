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
      <header className="pt-14 pb-4 px-6">
        <p className="text-[11px] font-bold text-amber-800 uppercase tracking-[0.2em] mb-1">
          Your Space
        </p>
        <h1 className="text-[2rem] font-semibold text-stone-800 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
          Hello, {user?.name} 👋
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {memories.length} {memories.length === 1 ? "memory" : "memories"} collected
        </p>
      </header>

      {/* Add a Memory CTA */}
      <div className="px-6 mb-6 mt-2">
        <Link
          href="/memories/new"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-stone-900 text-white text-sm font-semibold shadow-lg hover:bg-stone-800 transition-all active:scale-[0.98]"
        >
          <span className="text-lg">+</span> Add a Memory
        </Link>
      </div>

      {/* Timeline */}
      <div className="px-5">
        {memories.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="text-5xl">🌿</div>
            <h3 className="text-lg font-medium text-stone-600" style={{ fontFamily: "Georgia, serif" }}>
              Your story starts here
            </h3>
            <p className="text-sm text-stone-400">Add your first memory to begin.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 px-1">Timeline</h2>

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-stone-200/80 rounded-full" />

              <div className="space-y-5">
                {memories.map((memory) => (
                  <div key={memory.id} className="flex gap-4 relative">
                    {/* Timeline dot */}
                    <div className="shrink-0 w-6 h-6 rounded-full bg-amber-300 border-4 border-white shadow-md mt-3 z-10" />

                    {/* Memory Card */}
                    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/60 overflow-hidden">
                      {/* Card Header */}
                      <div className="px-4 pt-4 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <MemoryTypeIcon type={memory.type} />
                            <h3 className="font-semibold text-stone-800 text-[15px]" style={{ fontFamily: "Georgia, serif" }}>
                              {memory.title}
                            </h3>
                          </div>
                          <span className="text-xs text-stone-400 shrink-0">{formatDate(memory.date)}</span>
                        </div>
                        {memory.description && (
                          <p className="text-sm text-stone-400 mt-1 line-clamp-2">{memory.description}</p>
                        )}
                      </div>

                      {/* Media */}
                      {memory.mediaUrl && memory.type === "photo" && (
                        <div className="px-4 pb-1">
                          <img
                            src={memory.mediaUrl}
                            alt={memory.title}
                            className="w-full h-52 object-cover rounded-xl border border-stone-100"
                          />
                        </div>
                      )}
                      {memory.mediaUrl && memory.type === "video" && (
                        <div className="px-4 pb-1">
                          <video src={memory.mediaUrl} controls className="w-full rounded-xl" />
                        </div>
                      )}
                      {memory.mediaUrl && memory.type === "voice" && (
                        <div className="px-4 pb-1">
                          <audio src={memory.mediaUrl} controls className="w-full" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="px-4 py-3 flex gap-3">
                        <Link
                          href={`/memories/${memory.id}/edit`}
                          className="text-sm text-amber-600 hover:text-amber-800 font-semibold transition-colors"
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
    <span className="text-sm flex gap-2">
      <button onClick={handleDelete} className="text-red-500 font-semibold hover:text-red-700">
        Confirm
      </button>
      <button onClick={() => setConfirming(false)} className="text-stone-400">
        Cancel
      </button>
    </span>
  ) : (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-stone-400 hover:text-red-400 font-medium transition-colors"
    >
      Delete
    </button>
  );
}
