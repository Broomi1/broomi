"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

export default function AddMemoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const types = [
    {
      v: "text", l: "Written",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
    },
    {
      v: "photo", l: "Photo",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
    },
    {
      v: "video", l: "Video",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
      ),
    },
    {
      v: "voice", l: "Voice",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      ),
    },
  ];

  const FIELD: React.CSSProperties = {
    width: "100%",
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "999px",
    padding: "15px 20px 15px 50px",
    fontSize: "15px",
    color: "#4B2E28",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    boxSizing: "border-box",
  };

  const LABEL: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 800,
    color: "#4B2E28",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "block",
    textShadow: "0 1px 2px rgba(255,255,255,0.8)",
  };

  return (
    <div className="min-h-screen pb-36 relative overflow-hidden font-sans">

      {/* Ultra-stable fixed background for mobile */}
      <div 
        className="pointer-events-none"
        style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundImage: "url('/home-bg-new2.jpg')",
          backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
          zIndex: 0
        }}
      />

      {/* ── HEADER ── */}
      <header className="pt-20 px-6 pb-2 relative z-10 flex flex-col mt-4">
        <p style={{ fontFamily:"var(--font-caveat), cursive", fontSize:"1.5rem", color:"#4B2E28", marginBottom:"-4px" }}>
          Create a
        </p>
        <h1 style={{ fontFamily:"var(--font-caveat), cursive", fontSize:"3.4rem", fontWeight:800, color:"#4B2E28", lineHeight:1.1, marginBottom:"6px" }}>
          New Memory
        </h1>
        <p style={{ fontSize:"15px", color:"#5F4D4A", fontWeight:600 }}>
          Preserve a moment forever.
        </p>
      </header>

      {/* ── FORM ── */}
      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-6 relative z-10">
        {error && (
          <div style={{ background:"rgba(255,232,232,0.8)", backdropFilter:"blur(10px)", color:"#B04040", fontSize:"13px",
                        padding:"12px 16px", borderRadius:"14px", border:"1px solid rgba(255,204,204,0.5)" }}>
            {error}
          </div>
        )}

        {/* TYPE */}
        <div>
          <p style={LABEL}>Type</p>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {types.map(({ v, l, icon }) => {
              const active = type === v;
              return (
                <button key={v} type="button" onClick={() => setType(v)}
                  className="flex items-center gap-2 shrink-0 transition-all active:scale-95"
                  style={{
                    padding: "12px 20px",
                    borderRadius: "999px",
                    background: active ? "#4B2E28" : "rgba(255, 255, 255, 0.65)",
                    backdropFilter: active ? "none" : "blur(12px)",
                    color: active ? "white" : "#4B2E28",
                    border: active ? "1px solid #4B2E28" : "1px solid rgba(255, 255, 255, 0.4)",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: active ? "0 4px 12px rgba(75,46,40,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  }}>
                  {icon}
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* TITLE */}
        <div>
          <p style={LABEL}>Title</p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"20px", top:"50%", transform:"translateY(-50%)", color:"#4B2E28", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Name this memory..." required style={FIELD} className="placeholder-[#4B2E28]/50"/>
          </div>
        </div>

        {/* DATE */}
        <div>
          <p style={LABEL}>Date</p>
          <div style={{ position:"relative" }} onClick={() => dateInputRef.current?.showPicker?.()}>
            <span style={{ position:"absolute", left:"20px", top:"50%", transform:"translateY(-50%)", color:"#4B2E28", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <div style={{ ...FIELD, paddingRight:"46px", display:"flex", alignItems:"center", cursor:"pointer", userSelect:"none" }}>
              <span style={{ color:"#4B2E28", fontWeight:500 }}>{fmtDate(date)}</span>
            </div>
            <input ref={dateInputRef} type="date" value={date} onChange={e => setDate(e.target.value)} required
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }}/>
            <span style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", color:"#4B2E28", pointerEvents:"none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
        </div>

        {/* YOUR STORY */}
        <div>
          <p style={LABEL}>Your Story</p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"20px", top:"18px", color:"#4B2E28", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={type === "text" ? 6 : 4}
              className="placeholder-[#4B2E28]/50"
              style={{
                ...FIELD,
                borderRadius: "26px",
                paddingTop: "16px",
                paddingBottom: "16px",
                resize: "none",
                lineHeight: "1.65",
              }}/>
          </div>
        </div>

        {/* MEDIA UPLOAD */}
        {type !== "text" && (
          <div>
            <p style={LABEL}>
              {type === "photo" ? "Photo" : type === "video" ? "Video" : "Voice Note"}
            </p>
            <div onClick={() => fileRef.current?.click()}
              style={{
                background: "rgba(255,255,255,0.45)", backdropFilter:"blur(12px)", 
                borderRadius:"26px", border:"2px dashed rgba(75,46,40,0.4)",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", padding:"32px 16px", cursor:"pointer", minHeight:"140px",
                boxShadow:"inset 0 2px 10px rgba(0,0,0,0.02)"
              }}>
              {preview && type === "photo" ? (
                <img src={preview} alt="preview" style={{ maxHeight:"200px", borderRadius:"16px", objectFit:"cover", width:"100%", border:"1px solid rgba(255,255,255,0.5)" }}/>
              ) : preview && type === "video" ? (
                <video src={preview} controls style={{ maxHeight:"200px", borderRadius:"16px", width:"100%", border:"1px solid rgba(255,255,255,0.5)" }}/>
              ) : preview && type === "voice" ? (
                <audio src={preview} controls style={{ width:"100%" }}/>
              ) : (
                <>
                  <span style={{ fontSize:"40px", marginBottom:"12px", opacity:0.9 }}>
                    {type === "photo" ? "📷" : type === "video" ? "🎥" : "🎙️"}
                  </span>
                  <span style={{ fontSize:"15px", color:"#4B2E28", fontWeight:600 }}>Tap to upload</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display:"none" }}
              accept={type === "photo" ? "image/*" : type === "video" ? "video/*" : "audio/*"}/>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div style={{ paddingTop:"8px", paddingBottom:"12px" }}>
          <button type="submit" disabled={loading}
            style={{
              width:"100%", background:"rgba(75,46,40,0.9)", backdropFilter:"blur(10px)",
              color:"white", border:"1px solid rgba(255,255,255,0.2)",
              borderRadius:"999px", padding:"18px 24px", fontSize:"17px", fontWeight:600,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              letterSpacing:"0.02em", boxShadow:"0 8px 24px rgba(75,46,40,0.3)",
              transition:"all 0.2s",
            }}
            className="active:scale-95"
            >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/>
                  <path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              </span>
            ) : "Save Memory"}
          </button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbar::-webkit-scrollbar { display:none; }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}}/>

      <Nav />
    </div>
  );
}
