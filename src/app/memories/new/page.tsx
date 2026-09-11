"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

// Illustrated SVG icons for each type card
const WrittenIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="30" height="36" rx="3" fill="#F5ECD7" stroke="#7A5C38" strokeWidth="2"/>
    <line x1="14" y1="16" x2="34" y2="16" stroke="#7A5C38" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="14" y1="22" x2="34" y2="22" stroke="#7A5C38" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="14" y1="28" x2="26" y2="28" stroke="#7A5C38" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M30 32 L38 24 L42 28 L34 36 Z" fill="#C4894A" stroke="#7A5C38" strokeWidth="1"/>
    <path d="M34 36 L32 40 L36 38 Z" fill="#7A5C38"/>
  </svg>
);

const PhotoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="40" height="28" rx="4" fill="#F5ECD7" stroke="#7A5C38" strokeWidth="2"/>
    <circle cx="24" cy="26" r="8" stroke="#7A5C38" strokeWidth="2" fill="#E8D5B7"/>
    <circle cx="24" cy="26" r="4" fill="#C4894A" opacity="0.4"/>
    <rect x="16" y="7" width="16" height="7" rx="2" fill="#F5ECD7" stroke="#7A5C38" strokeWidth="1.5"/>
    <circle cx="36" cy="18" r="2" fill="#7A5C38"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="28" height="24" rx="4" fill="#F5ECD7" stroke="#7A5C38" strokeWidth="2"/>
    <path d="M32 18 L44 13 L44 35 L32 30 Z" fill="#E8D5B7" stroke="#7A5C38" strokeWidth="2"/>
    <circle cx="18" cy="24" r="5" fill="#C4894A" opacity="0.4" stroke="#7A5C38" strokeWidth="1.5"/>
    <polygon points="16,21 16,27 22,24" fill="#7A5C38"/>
  </svg>
);

const VoiceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="4" width="12" height="22" rx="6" fill="#F5ECD7" stroke="#7A5C38" strokeWidth="2"/>
    <path d="M10 24 C10 34 38 34 38 24" stroke="#7A5C38" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <line x1="24" y1="34" x2="24" y2="44" stroke="#7A5C38" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="44" x2="32" y2="44" stroke="#7A5C38" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="12" x2="26" y2="12" stroke="#C4894A" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="22" y1="17" x2="26" y2="17" stroke="#C4894A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

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

  // Format date nicely for display
  const formatDisplayDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const types = [
    { value: "text", label: "Written", icon: <WrittenIcon /> },
    { value: "photo", label: "Photo", icon: <PhotoIcon /> },
    { value: "video", label: "Video", icon: <VideoIcon /> },
    { value: "voice", label: "Voice", icon: <VoiceIcon /> },
  ];

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.55)",
    border: "none",
    borderRadius: "16px",
    padding: "15px 16px 15px 46px",
    fontSize: "14px",
    color: "#3D2B1A",
    outline: "none",
    boxSizing: "border-box" as const,
    backdropFilter: "blur(4px)",
  };

  return (
    <div
      className="min-h-screen pb-36"
      style={{
        backgroundImage: "url('/dashboard-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="pt-16 pb-4 px-6">
        <p className="text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-2">
          New Memory
        </p>
        <h1
          className="text-[2rem] font-bold text-black leading-tight"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
        >
          Preserve a moment<br />forever.{" "}
          <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "28px", color: "#C37A5C", fontWeight: 400 }}>♡</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="px-6 mt-2 space-y-6 pb-4">
        {error && (
          <div className="bg-red-50/80 text-red-600 text-sm p-3 rounded-xl">{error}</div>
        )}

        {/* CHOOSE TYPE */}
        <div>
          <label className="block text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-3">
            Choose Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className="flex flex-col items-center py-4 transition-all active:scale-[0.96] relative"
                style={{
                  background: type === t.value
                    ? "linear-gradient(145deg, #E8C97A, #D4A853)"
                    : "rgba(255,255,255,0.5)",
                  borderRadius: "14px",
                  border: type === t.value ? "none" : "1px solid rgba(200,185,165,0.4)",
                  backdropFilter: "blur(4px)",
                  // torn paper top edge effect
                  clipPath: type === t.value
                    ? "polygon(0% 2%,4% 0%,8% 2%,12% 0%,18% 2%,24% 0%,32% 1%,40% 0%,48% 1%,56% 0%,64% 2%,72% 0%,80% 1%,88% 0%,94% 2%,100% 0%,100% 100%,0% 100%)"
                    : "polygon(0% 3%,3% 0%,7% 2%,12% 0%,18% 2%,24% 0%,32% 1%,40% 0%,48% 2%,56% 0%,64% 1%,72% 0%,80% 2%,88% 0%,94% 1%,100% 0%,100% 100%,0% 100%)",
                  boxShadow: type === t.value ? "0 4px 14px rgba(180,130,40,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* Tape strip at top of selected card */}
                {type === t.value && (
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 rounded-sm"
                    style={{ background: "rgba(190,155,80,0.55)" }}
                  />
                )}
                <div className="mb-2">{t.icon}</div>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: type === t.value ? "#3D2010" : "#7A6050", textDecorationLine: type === t.value ? "underline" : "none", textUnderlineOffset: "3px" }}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div>
          <label className="block text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-2">
            Title
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A78] flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name this memory..."
              required
              style={inputStyle}
            />
            {/* Floral doodle hint */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C4A07A] opacity-50 text-xs pointer-events-none select-none" style={{ fontFamily: "var(--font-caveat), cursive" }}>✿</span>
          </div>
        </div>

        {/* DATE */}
        <div>
          <label className="block text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-2">
            Date
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68A78] flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none" }}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A68A78] pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>

        {/* YOUR STORY / Description */}
        <div>
          <label className="block text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-2">
            {type === "text" ? "Your Story" : "Description"}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-4 text-[#A68A78] flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={type === "text" ? 5 : 3}
              style={{
                ...inputStyle,
                padding: "14px 16px 14px 46px",
                resize: "none",
                lineHeight: "1.6",
              }}
            />
          </div>
        </div>

        {/* Media upload for photo/video/voice */}
        {type !== "text" && (
          <div>
            <label className="block text-[10px] font-bold text-[#A68A78] uppercase tracking-[0.15em] mb-2">
              {type === "photo" ? "Upload Photo" : type === "video" ? "Upload Video" : "Voice Note"}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center justify-center py-8 cursor-pointer transition-all active:scale-[0.99]"
              style={{
                background: "rgba(255,255,255,0.45)",
                border: "2px dashed rgba(164,134,100,0.4)",
                borderRadius: "20px",
                backdropFilter: "blur(4px)",
              }}
            >
              {preview && type === "photo" ? (
                <img src={preview} alt="preview" className="max-h-52 rounded-2xl object-cover w-full" />
              ) : preview && type === "video" ? (
                <video src={preview} className="max-h-52 rounded-2xl w-full" controls />
              ) : preview && type === "voice" ? (
                <audio src={preview} controls className="w-full px-4" />
              ) : (
                <>
                  <span className="text-4xl mb-3">
                    {type === "photo" ? "📷" : type === "video" ? "🎥" : "🎙️"}
                  </span>
                  <p className="text-sm font-medium" style={{ color: "#A68A78" }}>Tap to upload</p>
                  <p className="text-xs mt-1" style={{ color: "#C4A07A" }}>
                    {type === "photo" ? "JPG, PNG, HEIC" : type === "video" ? "MP4, MOV" : "MP3, M4A, WAV"}
                  </p>
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

        {/* SAVE MEMORY BUTTON */}
        <div className="pt-2 pb-2 relative">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[18px] rounded-full text-white flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-70 relative overflow-hidden"
            style={{
              background: "#1C1410",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
            }}
          >
            {/* Left floral deco */}
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A68A78] opacity-60 text-xs pointer-events-none" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "16px" }}>❧</span>

            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span className="flex items-center gap-2">
                <span style={{ color: "#C4A07A" }}>✦</span>
                Save Memory
                <span style={{ color: "#C4A07A" }}>✦</span>
              </span>
            )}

            {/* Right floral deco */}
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A68A78] opacity-60 pointer-events-none" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "16px" }}>✿</span>
          </button>
        </div>
      </form>

      <Nav />
    </div>
  );
}
