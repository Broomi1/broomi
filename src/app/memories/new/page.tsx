"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

export default function AddMemoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("text");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      if (f.type.startsWith("image/")) setType("photo");
      else if (f.type.startsWith("video/")) setType("video");
      else if (f.type.startsWith("audio/")) setType("voice");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let mediaUrl: string | null = null;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      mediaUrl = uploadData.url;
    }

    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type, date, mediaUrl }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Failed to save memory. Please try again.");
      setLoading(false);
    }
  };

  const types = [
    { value: "text", label: "Written", emoji: "✍️" },
    { value: "photo", label: "Photo", emoji: "📷" },
    { value: "video", label: "Video", emoji: "🎥" },
    { value: "voice", label: "Voice", emoji: "🎙️" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      <header className="pt-12 pb-4 px-6 bg-gradient-to-b from-amber-50 to-stone-50">
        <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-700 mb-4 flex items-center gap-1 text-sm">
          ← Back
        </button>
        <h1 className="text-3xl font-medium text-stone-800">New Memory</h1>
        <p className="text-stone-500 text-sm mt-1">Preserve a moment forever.</p>
      </header>

      <form onSubmit={handleSubmit} className="px-6 mt-4 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">{error}</div>
        )}

        {/* Type selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Type</label>
          <div className="grid grid-cols-4 gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex flex-col items-center py-3 rounded-2xl border transition-all ${
                  type === t.value
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="text-[10px] mt-1 font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this memory..."
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-stone-800 placeholder:text-stone-300"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-stone-800"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            {type === "text" ? "Your Story" : "Description"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something beautiful..."
            rows={type === "text" ? 6 : 3}
            className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-stone-800 placeholder:text-stone-300 resize-none"
          />
        </div>

        {/* Media upload */}
        {type !== "text" && (
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              {type === "photo" ? "Photo" : type === "video" ? "Video" : "Voice Note"}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-amber-300 transition-colors bg-white"
            >
              {preview && type === "photo" ? (
                <img src={preview} alt="preview" className="max-h-48 rounded-xl object-cover" />
              ) : preview && type === "video" ? (
                <video src={preview} className="max-h-48 rounded-xl w-full" controls />
              ) : preview && type === "voice" ? (
                <audio src={preview} controls className="w-full px-4" />
              ) : (
                <>
                  <span className="text-3xl mb-2">
                    {type === "photo" ? "📷" : type === "video" ? "🎥" : "🎙️"}
                  </span>
                  <p className="text-sm text-stone-400">Tap to upload</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={type === "photo" ? "image/*" : type === "video" ? "video/*" : "audio/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-stone-900 text-white font-medium shadow-md hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            "Save Memory ✨"
          )}
        </button>
      </form>
      <Nav />
    </div>
  );
}
