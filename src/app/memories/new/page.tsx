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
    background: "#E8DCDA",
    border: "none",
    borderRadius: "999px",
    padding: "15px 20px 15px 50px",
    fontSize: "15px",
    color: "#3C1A1A",
    outline: "none",
    boxSizing: "border-box",
  };

  const LABEL: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 800,
    color: "#3C1A1A",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "10px",
    display: "block",
  };

  return (
    <div className="min-h-screen pb-36 relative overflow-hidden" style={{ backgroundColor: "#F5EDE8" }}>

      {/* ── BACKGROUND BLOBS ── */}
      {/* White blob top-left */}
      <div style={{
        position: "absolute", top: "-60px", left: "-70px",
        width: "220px", height: "220px",
        borderRadius: "50% 60% 55% 65%",
        background: "rgba(255,255,255,0.85)",
        zIndex: 0,
      }}/>
      {/* Pink blob top-right */}
      <div style={{
        position: "absolute", top: "-40px", right: "-50px",
        width: "200px", height: "200px",
        borderRadius: "60% 40% 65% 45%",
        background: "#D9A8B0",
        zIndex: 0,
      }}/>
      {/* Pink blob bottom-left */}
      <div style={{
        position: "absolute", bottom: "80px", left: "-60px",
        width: "180px", height: "180px",
        borderRadius: "55% 65% 50% 70%",
        background: "#D9A8B0",
        zIndex: 0,
      }}/>
      {/* White blob bottom-right */}
      <div style={{
        position: "absolute", bottom: "60px", right: "-50px",
        width: "160px", height: "160px",
        borderRadius: "65% 45% 70% 50%",
        background: "rgba(255,255,255,0.75)",
        zIndex: 0,
      }}/>
      {/* Scattered heart outlines */}
      {[
        { top:"8%",  left:"6%",  size:22 },
        { top:"12%", left:"42%", size:18 },
        { top:"5%",  right:"4%", size:16 },
        { top:"32%", right:"4%", size:20 },
        { top:"52%", left:"3%",  size:18 },
        { bottom:"28%", left:"6%",  size:22 },
        { bottom:"22%", right:"6%", size:20 },
        { bottom:"12%", left:"42%", size:16 },
        { bottom:"10%", right:"38%",size:14 },
      ].map((pos, i) => (
        <svg key={i} width={pos.size} height={pos.size} viewBox="0 0 24 24" fill="none"
          stroke="#D9A8B0" strokeWidth="1.5"
          style={{ position:"absolute", zIndex:1, ...Object.fromEntries(Object.entries(pos).filter(([k])=>k!=="size")) }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ))}

      {/* ── POLAROID STACK TOP RIGHT ── */}
      <div style={{ position:"absolute", top:"12px", right:"10px", zIndex:2, width:"170px", height:"160px" }}>
        {/* Back polaroid — tilted */}
        <div style={{
          position:"absolute", top:"10px", right:"0px",
          width:"120px", background:"white", padding:"8px 8px 28px",
          boxShadow:"0 4px 14px rgba(0,0,0,0.12)",
          transform:"rotate(8deg)", borderRadius:"4px",
        }}>
          <div style={{ width:"100%", aspectRatio:"1", background:"#F5EADF", borderRadius:"2px" }}/>
          <p style={{ fontSize:"9px", color:"#8B6A5B", marginTop:"6px", textAlign:"center",
                       fontStyle:"italic", fontFamily:"var(--font-caveat), cursive" }}>
            Better together ♡
          </p>
        </div>
        {/* Paper clip */}
        <svg width="18" height="40" viewBox="0 0 18 40" fill="none" stroke="#888" strokeWidth="2"
          style={{ position:"absolute", top:"-4px", right:"54px", zIndex:4 }}>
          <path d="M9 2 C4 2 2 6 2 10 L2 30 C2 36 6 38 9 38 C12 38 16 36 16 30 L16 12 C16 8 14 6 11 6 C8 6 6 8 6 12 L6 28 C6 32 12 32 12 28 L12 14"/>
        </svg>
        {/* Front polaroid */}
        <div style={{
          position:"absolute", top:"0px", right:"40px",
          width:"110px", background:"white", padding:"8px 8px 28px",
          boxShadow:"0 6px 18px rgba(0,0,0,0.15)",
          transform:"rotate(-5deg)", borderRadius:"4px",
        }}>
          <div style={{ width:"100%", aspectRatio:"1", background:"#C8A080", borderRadius:"2px" }}/>
          <p style={{ fontSize:"0px" }}>&nbsp;</p>
        </div>
        {/* Sticky note */}
        <div style={{
          position:"absolute", bottom:"-4px", right:"-4px",
          width:"70px", padding:"8px",
          background:"#F5E9A8", boxShadow:"0 3px 8px rgba(0,0,0,0.1)",
          transform:"rotate(3deg)", borderRadius:"2px", zIndex:5,
        }}>
          <p style={{ fontSize:"11px", color:"#5A4020", lineHeight:1.3, fontFamily:"var(--font-caveat), cursive", fontWeight:600 }}>
            Good<br/>Vibes<br/>Only ♡
          </p>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="pt-20 px-6 pb-2 relative z-10">
        <p style={{ fontFamily:"var(--font-caveat), cursive", fontSize:"1.3rem", color:"#3C1A1A", marginBottom:"-4px", fontStyle:"italic" }}>
          Create a
        </p>
        <h1 style={{ fontFamily:"var(--font-caveat), cursive", fontSize:"3rem", fontWeight:800, color:"#2A0A0A", lineHeight:1.1, marginBottom:"6px" }}>
          New Memory
        </h1>
        <p style={{ fontSize:"14px", color:"#5A3A3A", fontWeight:500 }}>
          Preserve a moment forever.
        </p>
      </header>

      {/* ── FORM ── */}
      <form onSubmit={handleSubmit} className="px-6 mt-6 space-y-6 relative z-10">
        {error && (
          <div style={{ background:"#FFE8E8", color:"#B04040", fontSize:"13px",
                        padding:"10px 16px", borderRadius:"14px", border:"1px solid #FFCCCC" }}>
            {error}
          </div>
        )}

        {/* TYPE */}
        <div>
          <p style={LABEL}>Type</p>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {types.map(({ v, l, icon }) => {
              const active = type === v;
              return (
                <button key={v} type="button" onClick={() => setType(v)}
                  className="flex items-center gap-2 shrink-0 transition-all active:scale-95"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "999px",
                    background: active ? "#C8A0A8" : "#E8DCDA",
                    color: active ? "white" : "#3C1A1A",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: active ? "0 4px 12px rgba(160,80,100,0.25)" : "none",
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
            <span style={{ position:"absolute", left:"18px", top:"50%", transform:"translateY(-50%)",
                            color:"#8B6060", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Name this memory..." required style={FIELD}/>
          </div>
        </div>

        {/* DATE */}
        <div>
          <p style={LABEL}>Date</p>
          <div style={{ position:"relative" }} onClick={() => dateInputRef.current?.showPicker?.()}>
            <span style={{ position:"absolute", left:"18px", top:"50%", transform:"translateY(-50%)",
                            color:"#8B6060", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <div style={{ ...FIELD, paddingRight:"46px", display:"flex", alignItems:"center", cursor:"pointer", userSelect:"none" }}>
              <span style={{ color:"#3C1A1A" }}>{fmtDate(date)}</span>
            </div>
            <input ref={dateInputRef} type="date" value={date} onChange={e => setDate(e.target.value)} required
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }}/>
            <span style={{ position:"absolute", right:"18px", top:"50%", transform:"translateY(-50%)",
                            color:"#8B6060", pointerEvents:"none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
        </div>

        {/* YOUR STORY */}
        <div>
          <p style={LABEL}>Your Story</p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"18px", top:"18px", color:"#8B6060", display:"flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </span>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={type === "text" ? 6 : 4}
              style={{
                ...FIELD,
                borderRadius: "22px",
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
                background: "#E8DCDA", borderRadius:"22px", border:"2px dashed #C8A8A8",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", padding:"32px 16px", cursor:"pointer", minHeight:"120px",
              }}>
              {preview && type === "photo" ? (
                <img src={preview} alt="preview" style={{ maxHeight:"200px", borderRadius:"14px", objectFit:"cover", width:"100%" }}/>
              ) : preview && type === "video" ? (
                <video src={preview} controls style={{ maxHeight:"200px", borderRadius:"14px", width:"100%" }}/>
              ) : preview && type === "voice" ? (
                <audio src={preview} controls style={{ width:"100%" }}/>
              ) : (
                <>
                  <span style={{ fontSize:"40px", marginBottom:"8px" }}>
                    {type === "photo" ? "📷" : type === "video" ? "🎥" : "🎙️"}
                  </span>
                  <span style={{ fontSize:"14px", color:"#8B6060", fontWeight:500 }}>Tap to upload</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display:"none" }}
              accept={type === "photo" ? "image/*" : type === "video" ? "video/*" : "audio/*"}/>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div style={{ paddingTop:"4px", paddingBottom:"12px" }}>
          <button type="submit" disabled={loading}
            style={{
              width:"100%", background:"#2A0A0A", color:"white", border:"none",
              borderRadius:"999px", padding:"18px 24px", fontSize:"17px", fontWeight:600,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              letterSpacing:"0.02em", boxShadow:"0 6px 20px rgba(42,10,10,0.3)",
              transition:"opacity 0.2s",
            }}>
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
