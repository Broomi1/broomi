"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

/* ── Torn paper top edge for type cards ── */
const TornEdge = ({ fill }: { fill: string }) => (
  <svg viewBox="0 0 220 14" preserveAspectRatio="none"
    style={{ position:"absolute", top:0, left:0, width:"100%", height:"14px", display:"block", zIndex:2, pointerEvents:"none" }}>
    <path d="M0,14 L0,8 Q5,2 11,6 Q17,10 24,5 Q31,0 39,5 Q47,10 55,4 Q63,0 72,5 Q81,10 90,4 Q98,0 107,5 Q116,10 124,4 Q132,0 141,5 Q150,10 158,4 Q166,0 174,5 Q181,10 188,5 Q196,0 210,6 L220,5 L220,14 Z"
      fill={fill}/>
  </svg>
);

/* ── Sketch-style icons ── */
const WrittenIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#3D1E04" : "#6B4E30";
  const fillA = active ? "rgba(255,255,255,0.28)" : "rgba(160,130,90,0.10)";
  return (
    <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
      <rect x="10" y="7" width="24" height="32" rx="2" stroke={s} strokeWidth="1.7" fill={fillA}/>
      {[16,22,28].map(y => <line key={y} x1="15" y1={y} x2="29" y2={y} stroke={s} strokeWidth="1.3" strokeLinecap="round"/>)}
      <line x1="15" y1="28" x2="22" y2="28" stroke={s} strokeWidth="1.3" strokeLinecap="round"/>
      {[14,20,26,32].map(y => <path key={y} d={`M8 ${y} Q10 ${y-2.5} 12 ${y} Q10 ${y+2.5} 8 ${y}`} stroke={s} strokeWidth="1.1" fill="none"/>)}
      <path d="M30 29 L39 20 L43 24 L34 33 Z" stroke={s} strokeWidth="1.4" fill={active ? "rgba(255,255,255,0.35)" : "rgba(160,130,90,0.18)"} strokeLinejoin="round"/>
      <path d="M34 33 L32 38 L37 36 Z" fill={s} opacity="0.65"/>
    </svg>
  );
};

const PhotoIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#3D1E04" : "#6B4E30";
  const fillA = active ? "rgba(255,255,255,0.28)" : "rgba(160,130,90,0.10)";
  return (
    <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
      <rect x="4" y="14" width="44" height="28" rx="3.5" stroke={s} strokeWidth="1.7" fill={fillA}/>
      <path d="M16 14 L19 8 L33 8 L36 14" stroke={s} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <circle cx="26" cy="28" r="9" stroke={s} strokeWidth="1.6" fill="none"/>
      <circle cx="26" cy="28" r="4.5" stroke={s} strokeWidth="1.2" fill={fillA}/>
      <circle cx="38" cy="19" r="2.2" stroke={s} strokeWidth="1.2" fill="none"/>
    </svg>
  );
};

const VideoIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#3D1E04" : "#6B4E30";
  const fillA = active ? "rgba(255,255,255,0.28)" : "rgba(160,130,90,0.10)";
  return (
    <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
      <rect x="3" y="14" width="30" height="24" rx="3.5" stroke={s} strokeWidth="1.7" fill={fillA}/>
      <path d="M33 20 L47 14 L47 38 L33 32 Z" stroke={s} strokeWidth="1.5" fill={fillA} strokeLinejoin="round"/>
      <circle cx="18" cy="26" r="6" stroke={s} strokeWidth="1.3" fill="none"/>
      <polygon points="16,23 16,29 22,26" fill={s} opacity="0.6"/>
    </svg>
  );
};

const VoiceIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#3D1E04" : "#6B4E30";
  const fillA = active ? "rgba(255,255,255,0.28)" : "rgba(160,130,90,0.10)";
  return (
    <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
      <rect x="18" y="4" width="16" height="24" rx="8" stroke={s} strokeWidth="1.7" fill={fillA}/>
      <line x1="22" y1="12" x2="30" y2="12" stroke={s} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="18" x2="30" y2="18" stroke={s} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 27 C10 38 42 38 42 27" stroke={s} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <line x1="26" y1="38" x2="26" y2="46" stroke={s} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="46" x2="34" y2="46" stroke={s} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

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
      if (f.type.startsWith("image/")) setType("photo");
      else if (f.type.startsWith("video/")) setType("video");
      else if (f.type.startsWith("audio/")) setType("voice");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    let mediaUrl: string | null = null;
    if (file) {
      const fd = new FormData(); fd.append("file", file);
      mediaUrl = (await (await fetch("/api/upload", { method:"POST", body:fd })).json()).url;
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
    new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });

  const types = [
    { v:"text",  l:"Written", Icon: WrittenIcon },
    { v:"photo", l:"Photo",   Icon: PhotoIcon   },
    { v:"video", l:"Video",   Icon: VideoIcon   },
    { v:"voice", l:"Voice",   Icon: VoiceIcon   },
  ];

  /* shared field style */
  const FIELD: React.CSSProperties = {
    width: "100%",
    background: "rgba(242,232,214,0.60)",
    border: "1.5px solid rgba(165,135,95,0.28)",
    borderRadius: "18px",
    padding: "15px 18px 15px 50px",
    fontSize: "15px",
    color: "#2A1505",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const LABEL: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: 700,
    color: "#B89A72",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginBottom: "9px",
    display: "block",
  };

  const ICON_WRAP: React.CSSProperties = {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#A68A6A",
    display: "flex",
    alignItems: "center",
  };

  return (
    <div
      className="min-h-screen pb-44"
      style={{
        backgroundImage: "url('/dashboard-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── HEADER ── */}
      <header className="pt-16 px-6 pb-4">
        <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                    textTransform:"uppercase", marginBottom:"8px" }}>
          New Memory
        </p>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"2rem", fontWeight:800,
                       color:"#130800", lineHeight:1.18, letterSpacing:"-0.015em",
                       paddingRight:"48px" }}>
            Preserve a moment<br/>forever.
            {/* hand-drawn heart */}
            <svg display="inline" width="30" height="28" viewBox="0 0 32 30" style={{ verticalAlign:"middle", marginLeft:"6px" }}>
              <path d="M16 27 C16 27 3 18 3 9 C3 5 7 2 11 3 C13 3 15 5 16 7 C17 5 19 3 21 3 C25 2 29 5 29 9 C29 18 16 27 16 27Z"
                stroke="#B87A5A" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </h1>
          {/* paper airplane */}
          <svg width="32" height="26" viewBox="0 0 34 28" fill="none"
            style={{ position:"absolute", top:"2px", right:"4px", opacity:0.38 }}>
            <path d="M2 14 L32 2 L20 26 L14 16 Z" stroke="#A68A6A" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
            <path d="M14 16 L32 2" stroke="#A68A6A" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-5 space-y-6">
        {error && (
          <div style={{ background:"#FFF0EE", color:"#B03030", fontSize:"13px",
                        padding:"10px 16px", borderRadius:"14px", border:"1px solid #FFCCCC" }}>
            {error}
          </div>
        )}

        {/* ── CHOOSE TYPE ── */}
        <div>
          <p style={LABEL}>Choose Type</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
            {types.map(({ v, l, Icon }) => {
              const active = type === v;
              const cardBg = active ? "#C8943A" : "rgba(248,240,224,0.90)";
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setType(v)}
                  style={{
                    position: "relative",
                    background: cardBg,
                    border: active ? "none" : "1.5px solid rgba(175,150,110,0.32)",
                    borderRadius: "0 0 16px 16px",
                    paddingTop: "20px",
                    paddingBottom: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    overflow: "visible",
                    boxShadow: active
                      ? "0 6px 20px rgba(150,95,10,0.28)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <TornEdge fill={cardBg} />

                  {/* Tape strip — active card only */}
                  {active && (
                    <div style={{
                      position: "absolute", top:"-9px", left:"50%",
                      transform: "translateX(-50%) rotate(-1deg)",
                      width: "38px", height: "15px",
                      background: "rgba(200,168,75,0.55)",
                      borderRadius: "3px", zIndex:3,
                    }}/>
                  )}

                  <Icon active={active} />

                  <span style={{
                    fontSize: "11px", fontWeight: 700,
                    color: active ? "#2A0E00" : "#7A5C38",
                    textDecoration: active ? "underline" : "none",
                    textUnderlineOffset: "3px",
                    letterSpacing: "0.02em",
                  }}>
                    {l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TITLE ── */}
        <div>
          <p style={LABEL}>Title</p>
          <div style={{ position:"relative" }}>
            <span style={ICON_WRAP}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </span>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Name this memory..."
              required
              style={FIELD}
            />
          </div>
        </div>

        {/* ── DATE ── */}
        <div>
          <p style={LABEL}>Date</p>
          <div style={{ position:"relative" }} onClick={() => dateInputRef.current?.showPicker?.()}>
            <span style={ICON_WRAP}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            {/* styled display */}
            <div style={{ ...FIELD, cursor:"pointer", display:"flex", alignItems:"center",
                          paddingRight:"44px", userSelect:"none" }}>
              <span style={{ color: date ? "#2A1505" : "#B09A7A" }}>
                {date ? fmtDate(date) : "Pick a date"}
              </span>
            </div>
            {/* hidden real input */}
            <input ref={dateInputRef} type="date" value={date}
              onChange={e => setDate(e.target.value)} required
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer",
                        width:"100%", height:"100%", border:"none", background:"transparent" }}/>
            {/* chevron */}
            <span style={{ position:"absolute", right:"16px", top:"50%",
                            transform:"translateY(-50%)", color:"#A68A6A",
                            display:"flex", pointerEvents:"none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </div>
        </div>

        {/* ── YOUR STORY ── */}
        <div>
          <p style={LABEL}>Your Story</p>
          <div style={{ position:"relative" }}>
            {/* tape corner */}
            <div style={{
              position:"absolute", top:"-7px", right:"22px",
              width:"34px", height:"12px",
              background:"rgba(195,162,85,0.42)",
              borderRadius:"3px", transform:"rotate(2deg)", zIndex:1,
            }}/>
            <span style={{ position:"absolute", left:"16px", top:"16px",
                            color:"#A68A6A", display:"flex" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={type === "text" ? 6 : 4}
              style={{ ...FIELD, paddingTop:"14px", paddingBottom:"14px",
                        resize:"none", lineHeight:"1.65" }}
            />
          </div>
        </div>

        {/* ── MEDIA UPLOAD ── */}
        {type !== "text" && (
          <div>
            <p style={LABEL}>
              {type==="photo" ? "Upload Photo" : type==="video" ? "Upload Video" : "Voice Note"}
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width:"100%", background:"rgba(242,232,214,0.50)",
                border:"2px dashed rgba(165,135,95,0.38)",
                borderRadius:"18px", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center",
                padding:"32px 16px", cursor:"pointer", minHeight:"130px",
              }}
            >
              {preview && type==="photo" ? (
                <img src={preview} alt="preview"
                  style={{ maxHeight:"200px", borderRadius:"12px", objectFit:"cover", width:"100%" }}/>
              ) : preview && type==="video" ? (
                <video src={preview} controls style={{ maxHeight:"200px", borderRadius:"12px", width:"100%" }}/>
              ) : preview && type==="voice" ? (
                <audio src={preview} controls style={{ width:"100%" }}/>
              ) : (
                <>
                  <span style={{ fontSize:"44px", marginBottom:"10px" }}>
                    {type==="photo" ? "📷" : type==="video" ? "🎥" : "🎙️"}
                  </span>
                  <span style={{ fontSize:"14px", color:"#A68A6A", fontWeight:500 }}>Tap to upload</span>
                  <span style={{ fontSize:"12px", color:"#C4A07A", marginTop:"4px" }}>
                    {type==="photo" ? "JPG, PNG, HEIC" : type==="video" ? "MP4, MOV" : "MP3, WAV"}
                  </span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display:"none" }}
              accept={type==="photo" ? "image/*" : type==="video" ? "video/*" : "audio/*"}/>
          </div>
        )}

        {/* ── SAVE MEMORY BUTTON ── */}
        <div style={{ paddingTop:"8px", paddingBottom:"16px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#130D06",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "999px",
              padding: "18px 28px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.72 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
              letterSpacing: "0.025em",
              transition: "opacity 0.2s",
            }}
          >
            {/* left botanical leaf */}
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none"
              style={{ position:"absolute", left:"20px", top:"50%", transform:"translateY(-50%)", opacity:0.65 }}>
              <path d="M11 22 C11 22 2 15 2 8 C2 4 5 1 11 1 C17 1 20 4 20 8 C20 15 11 22 11 22Z"
                stroke="#C4A04A" strokeWidth="1.3" fill="none"/>
              <path d="M11 22 L11 1" stroke="#C4A04A" strokeWidth="0.9" strokeDasharray="2,2"/>
            </svg>

            {loading ? (
              <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/>
                <path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <span style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ color:"#D4A853" }}>✦</span>
                Save Memory
                <span style={{ color:"#D4A853" }}>✦</span>
              </span>
            )}

            {/* right botanical flower */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", opacity:0.65 }}>
              <circle cx="12" cy="12" r="3" fill="#C4A04A"/>
              {[0,60,120,180,240,300].map((a,i) => {
                const rad = a * Math.PI/180;
                return <ellipse key={i} cx={12+6.5*Math.cos(rad)} cy={12+6.5*Math.sin(rad)}
                  rx="2.5" ry="1.4" transform={`rotate(${a},${12+6.5*Math.cos(rad)},${12+6.5*Math.sin(rad)})`}
                  fill="#C4A04A"/>;
              })}
            </svg>
          </button>
        </div>
      </form>

      <Nav />
    </div>
  );
}
