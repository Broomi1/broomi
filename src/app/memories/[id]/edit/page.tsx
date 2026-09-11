"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function EditMemoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("text");
  const [date, setDate] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Load existing memory
  useEffect(() => {
    if (status !== "authenticated" || !id) return;
    fetch("/api/memories")
      .then((res) => res.json())
      .then((memories) => {
        const memory = memories.find((m: any) => m.id === id);
        if (!memory) { router.push("/dashboard"); return; }
        setTitle(memory.title);
        setDescription(memory.description || "");
        setType(memory.type);
        setDate(memory.date ? memory.date.substring(0, 10) : "");
        setMediaUrl(memory.mediaUrl || null);
        setLoading(false);
      });
  }, [status, id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let finalMediaUrl = mediaUrl;

    // Upload new file if selected
    if (newFile) {
      const formData = new FormData();
      formData.append("file", newFile);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        finalMediaUrl = uploadData.url;
      } else {
        setError("File upload failed. Please try again.");
        setSaving(false);
        return;
      }
    }

    const res = await fetch(`/api/memories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        type,
        date,
        mediaUrl: finalMediaUrl,
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Failed to save changes.");
      setSaving(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-gradient-to-b from-amber-50 to-stone-50 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-stone-200 shadow-sm text-stone-500 hover:text-stone-800 transition"
        >
          ←
        </button>
        <h1 className="text-xl font-medium text-stone-800">Edit Memory</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Type selector */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Type</label>
          <div className="flex gap-2 flex-wrap">
            {["photo", "video", "voice", "text"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  type === t
                    ? "bg-stone-900 text-white shadow"
                    : "bg-white text-stone-600 border border-stone-200"
                }`}
              >
                {t === "photo" ? "📷" : t === "video" ? "🎥" : t === "voice" ? "🎙️" : "✍️"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800 resize-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 text-stone-800"
          />
        </div>

        {/* Media upload (for photo/video/voice) */}
        {(type === "photo" || type === "video" || type === "voice") && (
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">
              {newFile ? "New File Selected" : "Replace Media (optional)"}
            </label>

            {/* Show current media */}
            {!preview && mediaUrl && (
              <div className="mb-3">
                {type === "photo" && (
                  <img src={mediaUrl} alt="current" className="w-full h-40 object-cover rounded-xl border border-stone-200" />
                )}
                {type === "video" && (
                  <video src={mediaUrl} controls className="w-full rounded-xl" />
                )}
                {type === "voice" && (
                  <audio src={mediaUrl} controls className="w-full" />
                )}
                <p className="text-xs text-stone-400 mt-1 text-center">Current file — upload a new one to replace it</p>
              </div>
            )}

            {/* Preview new file */}
            {preview && type === "photo" && (
              <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-amber-200 mb-3" />
            )}
            {preview && type === "video" && (
              <video src={preview} controls className="w-full rounded-xl mb-3" />
            )}
            {preview && type === "voice" && (
              <audio src={preview} controls className="w-full mb-3" />
            )}

            <label className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 text-sm hover:border-amber-400 hover:text-amber-600 transition cursor-pointer">
              <span>📎</span>
              <span>{newFile ? newFile.name : "Choose a new file"}</span>
              <input
                type="file"
                className="hidden"
                accept={type === "photo" ? "image/*" : type === "video" ? "video/*" : "audio/*"}
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
        >
          {saving ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : "✓"} {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <Nav />
    </div>
  );
}
