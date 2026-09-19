"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Memory {
  id: string;
  title: string;
  description: string | null;
  type: string;
  mediaUrl: string | null;
  date: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetch(`/api/memories`)
        .then(r => r.json())
        .then((data: Memory[]) => {
          const m = data.find(m => m.id === id);
          if (m) {
            setMemory(m);
            setEditTitle(m.title);
            setEditDesc(m.description ?? "");
            setEditDate(m.date.slice(0, 10));
          } else {
            router.push("/gallery");
          }
          setLoading(false);
        });
    }
  }, [status, id, router]);

  const handleSave = async () => {
    if (!memory) return;
    setSaving(true);
    const res = await fetch(`/api/memories/${memory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
        type: memory.type,
        date: editDate,
        mediaUrl: memory.mediaUrl,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMemory(updated);
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!memory) return;
    setDeleting(true);
    await fetch(`/api/memories/${memory.id}`, { method: "DELETE" });
    router.push("/gallery");
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5EDE8" }}>
        <div className="animate-spin w-10 h-10 border-4 border-[#4B2E28] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!memory) return null;

  const typeIcon = memory.type === "photo" ? "📷" : memory.type === "video" ? "🎥" : memory.type === "voice" ? "🎙️" : "📝";

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden">
      {/* Fixed background */}
      <div
        className="pointer-events-none"
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundImage: "url('/profile-bg-v2.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* ── TOP NAV ── */}
      <header className="relative z-20 flex justify-between items-center px-5 pt-12 pb-4">
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* Edit toggle */}
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C45252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          {/* Delete */}
          <button onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C45252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div className="relative z-10 px-5 pb-24 space-y-5">

        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcon}</span>
          <span className="text-sm font-bold text-[#4B2E28] uppercase tracking-widest opacity-80"
            style={{ textShadow: "0 1px 3px rgba(255,255,255,0.8)" }}>
            {memory.type}
          </span>
        </div>

        {/* Media */}
        {memory.mediaUrl && memory.type === "photo" && (
          <div className="rounded-[24px] overflow-hidden shadow-xl border-4 border-white/70">
            <img src={memory.mediaUrl} alt={memory.title} className="w-full object-cover max-h-[65vw]" />
          </div>
        )}
        {memory.mediaUrl && memory.type === "video" && (
          <div className="rounded-[24px] overflow-hidden shadow-xl border-4 border-white/70">
            <video src={memory.mediaUrl} controls className="w-full" />
          </div>
        )}
        {memory.mediaUrl && memory.type === "voice" && (
          <div className="rounded-[24px] p-4 border border-white/40 shadow-md" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(14px)" }}>
            <audio src={memory.mediaUrl} controls className="w-full" />
          </div>
        )}
        {!memory.mediaUrl && memory.type === "text" && (
          <div className="text-6xl text-center py-4">📝</div>
        )}

        {/* Title + Date card */}
        <div className="rounded-[24px] p-5 border border-white/40 shadow-lg space-y-3"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)" }}>
          {isEditing ? (
            <>
              <div>
                <label className="text-[11px] font-bold text-[#5F4D4A] uppercase tracking-widest mb-1 block">Title</label>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-white/80 border border-white/50 rounded-xl px-4 py-2.5 text-[#4B2E28] text-[16px] font-bold outline-none focus:border-[#4B2E28] transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5F4D4A] uppercase tracking-widest mb-1 block">Date</label>
                <div className="relative" onClick={() => dateInputRef.current?.showPicker?.()}>
                  <div className="w-full bg-white/80 border border-white/50 rounded-xl px-4 py-2.5 text-[#4B2E28] text-sm font-medium cursor-pointer">
                    {formatDate(editDate)}
                  </div>
                  <input ref={dateInputRef} type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[2rem] font-bold text-[#4B2E28] leading-tight"
                style={{ fontFamily: "var(--font-caveat), cursive" }}>
                {memory.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#5F4D4A] font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(memory.date)}
              </div>
            </>
          )}
        </div>

        {/* Description card */}
        <div className="rounded-[24px] p-5 border border-white/40 shadow-lg"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)" }}>
          <label className="text-[11px] font-bold text-[#5F4D4A] uppercase tracking-widest mb-2 block">Story</label>
          {isEditing ? (
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              rows={5}
              placeholder="Write something beautiful..."
              className="w-full bg-white/80 border border-white/50 rounded-xl px-4 py-3 text-[#4B2E28] text-[15px] outline-none resize-none focus:border-[#4B2E28] transition leading-relaxed"
            />
          ) : (
            <p className="text-[#4B2E28] text-[15px] leading-relaxed whitespace-pre-wrap">
              {memory.description || <span className="opacity-40 italic">No description added.</span>}
            </p>
          )}
        </div>

        {/* Save button (edit mode) */}
        {isEditing && (
          <button onClick={handleSave} disabled={saving}
            className="w-full py-4 rounded-[999px] text-white font-bold text-[16px] active:scale-95 transition-all shadow-lg"
            style={{ background: "#4B2E28", opacity: saving ? 0.7 : 1 }}>
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.3" />
                  <path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : "Save Changes"}
          </button>
        )}
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-md mx-4 mb-8 rounded-[28px] p-6 border border-white/30 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)" }}>
            <h2 className="text-[1.6rem] font-bold text-[#4B2E28] mb-1" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              Delete this memory?
            </h2>
            <p className="text-sm text-[#5F4D4A] mb-6">This cannot be undone. The memory will be gone forever.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-[999px] font-semibold text-[#4B2E28] border border-[#4B2E28]/30 bg-white/60 active:scale-95 transition">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 rounded-[999px] font-bold text-white active:scale-95 transition shadow-md"
                style={{ background: "#C45252", opacity: deleting ? 0.7 : 1 }}>
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
