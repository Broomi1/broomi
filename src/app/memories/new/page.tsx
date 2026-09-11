"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

/* ─── Hand-drawn style SVG icons ─── */
function IconWritten({ active }: { active: boolean }) {
  const c = active ? "#5C3010" : "#8B7055";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* notebook */}
      <rect x="8" y="7" width="22" height="28" rx="2" stroke={c} strokeWidth="1.6" fill={active ? "rgba(255,255,255,0.3)" : "rgba(200,180,150,0.18)"}/>
      <line x1="12" y1="14" x2="26" y2="14" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="26" y2="19" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="12" y1="24" x2="20" y2="24" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
      {/* spiral */}
      <line x1="8" y1="11" x2="8" y2="11" stroke={c} strokeWidth="1.2"/>
      <path d="M6 10 Q8 8 10 10 Q8 12 6 10" stroke={c} strokeWidth="1.1" fill="none"/>
      <path d="M6 16 Q8 14 10 16 Q8 18 6 16" stroke={c} strokeWidth="1.1" fill="none"/>
      <path d="M6 22 Q8 20 10 22 Q8 24 6 22" stroke={c} strokeWidth="1.1" fill="none"/>
      {/* pencil */}
      <path d="M26 26 L33 19 L36 22 L29 29 Z" stroke={c} strokeWidth="1.3" fill={active ? "rgba(255,255,255,0.4)" : "rgba(200,180,150,0.3)"}/>
      <path d="M29 29 L27 34 L32 32 Z" stroke={c} strokeWidth="1.1" fill={c} opacity="0.6"/>
      <line x1="33" y1="19" x2="36" y2="22" stroke={c} strokeWidth="1.1"/>
    </svg>
  );
}

function IconPhoto({ active }: { active: boolean }) {
  const c = active ? "#5C3010" : "#8B7055";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="4" y="13" width="36" height="23" rx="3" stroke={c} strokeWidth="1.6" fill={active ? "rgba(255,255,255,0.3)" : "rgba(200,180,150,0.18)"}/>
      <path d="M14 13 L17 8 L27 8 L30 13" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <circle cx="22" cy="24" r="7" stroke={c} strokeWidth="1.5" fill="none"/>
      <circle cx="22" cy="24" r="3.5" stroke={c} strokeWidth="1.2" fill={active ? "rgba(255,255,255,0.3)" : "rgba(200,180,150,0.25)"}/>
      <circle cx="33" cy="18" r="1.5" stroke={c} strokeWidth="1.1" fill="none"/>
    </svg>
  );
}

function IconVideo({ active }: { active: boolean }) {
  const c = active ? "#5C3010" : "#8B7055";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="3" y="12" width="26" height="20" rx="3" stroke={c} strokeWidth="1.6" fill={active ? "rgba(255,255,255,0.3)" : "rgba(200,180,150,0.18)"}/>
      <path d="M29 18 L41 13 L41 31 L29 26 Z" stroke={c} strokeWidth="1.4" fill={active ? "rgba(255,255,255,0.2)" : "rgba(200,180,150,0.15)"} strokeLinejoin="round"/>
      <circle cx="16" cy="22" r="5" stroke={c} strokeWidth="1.3" fill="none"/>
      <polygon points="14,19.5 14,24.5 19,22" fill={c} opacity="0.7"/>
    </svg>
  );
}

function IconVoice({ active }: { active: boolean }) {
  const c = active ? "#5C3010" : "#8B7055";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* mic body */}
      <rect x="15" y="5" width="14" height="20" rx="7" stroke={c} strokeWidth="1.6" fill={active ? "rgba(255,255,255,0.3)" : "rgba(200,180,150,0.18)"}/>
      {/* sound lines */}
      <line x1="20" y1="12" x2="24" y2="12" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="20" y1="16" x2="24" y2="16" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
      {/* stand arc */}
      <path d="M9 24 C9 35 35 35 35 24" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* stand base */}
      <line x1="22" y1="35" x2="22" y2="42" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="42" x2="29" y2="42" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Torn paper top SVG (as a background image trick) ─── */
function TornTop({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, width: "100%", height: "14px", display: "block" }}
    >
      <path
        d="M0,14 L0,7 Q5,2 10,6 Q15,10 22,5 Q28,1 35,6 Q42,11 50,5 Q57,0 65,5 Q73,10 80,4 Q88,0 96,5 Q103,10 110,4 Q118,0 126,5 Q134,10 142,4 Q149,0 157,5 Q164,10 172,4 Q180,0 188,5 Q194,9 200,6 L200,14 Z"
        fill={color}
      />
    </svg>
  );
}

export default function AddMemoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

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
      setPreview(URL.createObjectURL(f));
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
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      mediaUrl = (await r.json()).url;
    }
    const res = await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type, date, mediaUrl }),
    });
    if (res.ok) router.push("/dashboard");
    else { setError("Failed to save. Please try again."); setLoading(false); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const types = [
    { value: "text",  label: "Written", Icon: IconWritten },
    { value: "photo", label: "Photo",   Icon: IconPhoto   },
    { value: "video", label: "Video",   Icon: IconVideo   },
    { value: "voice", label: "Voice",   Icon: IconVoice   },
  ];

  /* shared field wrapper */
  const fieldBg = "rgba(245,238,225,0.75)";
  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: fieldBg,
    border: "1.5px solid rgba(180,155,120,0.35)",
    borderRadius: "18px",
    padding: "14px 16px 14px 48px",
    fontSize: "15px",
    color: "#3D2410",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
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
      {/* ── HEADER ── */}
      <header className="pt-16 px-6 pb-2">
        <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>
          New Memory
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 800, color: "#1A0F06", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          Preserve a moment<br />forever.{" "}
          <svg display="inline" width="28" height="28" viewBox="0 0 30 30" style={{ verticalAlign: "middle", marginLeft: "2px" }}>
            <path d="M15 26 C15 26 4 18 4 10 C4 6 7 3 10.5 3 C12.5 3 14 4.5 15 6 C16 4.5 17.5 3 19.5 3 C23 3 26 6 26 10 C26 18 15 26 15 26Z" stroke="#C37A5C" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="px-5 mt-5 space-y-5">
        {error && (
          <div style={{ background: "#FFF0EE", color: "#C04040", fontSize: "13px", padding: "10px 14px", borderRadius: "14px", border: "1px solid #FDD" }}>
            {error}
          </div>
        )}

        {/* ── CHOOSE TYPE ── */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>
            Choose Type
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {types.map(({ value, label, Icon }) => {
              const active = type === value;
              const cardBg = active ? "#C8943A" : "rgba(245,238,225,0.85)";
              const cardBorder = active ? "none" : "1.5px solid rgba(180,155,120,0.3)";
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  style={{
                    position: "relative",
                    background: cardBg,
                    border: cardBorder,
                    borderRadius: "0 0 14px 14px",
                    paddingTop: "22px",
                    paddingBottom: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    overflow: "visible",
                    boxShadow: active ? "0 4px 16px rgba(160,100,20,0.25)" : "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Torn paper top */}
                  <TornTop color={cardBg} />

                  {/* Tape strip for active */}
                  {active && (
                    <div style={{
                      position: "absolute",
                      top: "-8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "36px",
                      height: "14px",
                      background: "rgba(200,165,80,0.6)",
                      borderRadius: "3px",
                      zIndex: 2,
                    }} />
                  )}

                  <Icon active={active} />

                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: active ? "#3D1A06" : "#7A5C38",
                    textDecoration: active ? "underline" : "none",
                    textUnderlineOffset: "3px",
                    letterSpacing: "0.02em",
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TITLE ── */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>
            Title
          </p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A68A6A", display: "flex" }}>
              {/* price-tag icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name this memory..."
              required
              style={{ ...fieldStyle, paddingRight: "40px" }}
            />
            {/* floral hint right */}
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", opacity: 0.4, pointerEvents: "none", lineHeight: 1 }}>🌿</span>
          </div>
        </div>

        {/* ── DATE ── */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>
            Date
          </p>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => dateRef.current?.showPicker?.()}
          >
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#A68A6A", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            {/* Visible date display */}
            <div style={{ ...fieldStyle, paddingRight: "40px", display: "flex", alignItems: "center" }}>
              <span style={{ color: date ? "#3D2410" : "#B0997A" }}>{date ? formatDate(date) : "Pick a date"}</span>
            </div>
            {/* Hidden real date input */}
            <input
              ref={dateRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ position: "absolute", opacity: 0, inset: 0, cursor: "pointer", width: "100%", height: "100%", border: "none", background: "transparent" }}
            />
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#A68A6A", pointerEvents: "none", display: "flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </div>
        </div>

        {/* ── YOUR STORY ── */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>
            Your Story
          </p>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "16px", color: "#A68A6A", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={5}
              style={{
                ...fieldStyle,
                paddingTop: "14px",
                paddingBottom: "14px",
                resize: "none",
                lineHeight: "1.65",
              }}
            />
          </div>
        </div>

        {/* ── MEDIA UPLOAD (for non-text types) ── */}
        {type !== "text" && (
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#A68A6A", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>
              {type === "photo" ? "Upload Photo" : type === "video" ? "Upload Video" : "Voice Note"}
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: "100%",
                background: "rgba(245,238,225,0.65)",
                border: "2px dashed rgba(180,155,120,0.45)",
                borderRadius: "18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 16px",
                cursor: "pointer",
                minHeight: "130px",
              }}
            >
              {preview && type === "photo" ? (
                <img src={preview} alt="preview" style={{ maxHeight: "200px", borderRadius: "12px", objectFit: "cover", width: "100%" }} />
              ) : preview && type === "video" ? (
                <video src={preview} controls style={{ maxHeight: "200px", borderRadius: "12px", width: "100%" }} />
              ) : preview && type === "voice" ? (
                <audio src={preview} controls style={{ width: "100%" }} />
              ) : (
                <>
                  <span style={{ fontSize: "40px", marginBottom: "10px" }}>
                    {type === "photo" ? "📷" : type === "video" ? "🎥" : "🎙️"}
                  </span>
                  <span style={{ fontSize: "14px", color: "#A68A6A", fontWeight: 500 }}>Tap to upload</span>
                  <span style={{ fontSize: "12px", color: "#C4A07A", marginTop: "4px" }}>
                    {type === "photo" ? "JPG, PNG, HEIC" : type === "video" ? "MP4, MOV" : "MP3, M4A, WAV"}
                  </span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={type === "photo" ? "image/*" : type === "video" ? "video/*" : "audio/*"}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        )}

        {/* ── SAVE MEMORY BUTTON ── */}
        <div style={{ paddingTop: "4px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#18110A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "18px 24px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
              letterSpacing: "0.02em",
            }}
          >
            {/* Left botanical */}
            <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "22px", opacity: 0.7 }}>🌿</span>

            {loading ? (
              <svg className="animate-spin" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#D4A853", fontSize: "14px" }}>✦</span>
                Save Memory
                <span style={{ color: "#D4A853", fontSize: "14px" }}>✦</span>
              </span>
            )}

            {/* Right botanical */}
            <span style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "22px", opacity: 0.7 }}>🌸</span>
          </button>
        </div>
      </form>

      <Nav />
    </div>
  );
}
