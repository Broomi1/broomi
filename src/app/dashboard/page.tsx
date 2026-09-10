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
  return <span>{icons[type] || "📝"}</span>;
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
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
      </div>
    );
  }

  const user = session?.user as any;

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-gradient-to-b from-amber-50 to-stone-50">
        <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-1">
          Your Space
        </p>
        <h1 className="text-3xl font-medium text-stone-800">
          Hello, {user?.name} 👋
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {memories.length} {memories.length === 1 ? "memory" : "memories"} collected
        </p>
      </header>

      {/* Quick actions */}
      <div className="px-6 mb-6">
        <Link
          href="/memories/new"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-stone-900 text-white text-sm font-medium shadow-md hover:bg-stone-800 transition-all active:scale-[0.98]"
        >
          <span className="text-lg">+</span> Add a Memory
        </Link>
      </div>

      {/* Timeline */}
      <div className="px-6">
        {memories.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">🌿</div>
            <h3 className="text-lg font-medium text-stone-600">Your story starts here</h3>
            <p className="text-sm text-stone-400">Add your first memory to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">Timeline</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-200" />
              <div className="space-y-6 pl-10">
                {memories.map((memory) => (
                  <div key={memory.id} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-amber-300 border-2 border-white shadow" />
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <MemoryTypeIcon type={memory.type} />
                          <h3 className="font-medium text-stone-800 text-sm">{memory.title}</h3>
                        </div>
                        <span className="text-xs text-stone-400 shrink-0">{formatDate(memory.date)}</span>
                      </div>
                      {memory.description && (
                        <p className="text-sm text-stone-500 line-clamp-2">{memory.description}</p>
                      )}
                      {memory.mediaUrl && memory.type === "photo" && (
                        <img
                          src={memory.mediaUrl}
                          alt={memory.title}
                          className="mt-3 w-full h-40 object-cover rounded-xl"
                        />
                      )}
                      {memory.mediaUrl && memory.type === "video" && (
                        <video
                          src={memory.mediaUrl}
                          controls
                          className="mt-3 w-full rounded-xl"
                        />
                      )}
                      {memory.mediaUrl && memory.type === "voice" && (
                        <audio src={memory.mediaUrl} controls className="mt-3 w-full" />
                      )}
                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/memories/${memory.id}/edit`}
                          className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteButton id={memory.id} onDelete={() => setMemories((m) => m.filter((x) => x.id !== memory.id))} />
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
    <span className="text-xs">
      <button onClick={handleDelete} className="text-red-500 font-medium hover:text-red-700 mr-1">Confirm</button>
      <button onClick={() => setConfirming(false)} className="text-stone-400">Cancel</button>
    </span>
  ) : (
    <button onClick={() => setConfirming(true)} className="text-xs text-stone-400 hover:text-red-400 font-medium">
      Delete
    </button>
  );
}
