"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Nav from "@/components/Nav";

/* ── tiny inline decorations ── */
const LeafDoodle = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={style}>
    <path d="M9 20 C9 20 2 14 2 7 C2 3 5 1 9 1 C13 1 16 3 16 7 C16 14 9 20 9 20Z" stroke="#A68A6A" strokeWidth="1.2" fill="none" opacity="0.5"/>
    <path d="M9 20 L9 1" stroke="#A68A6A" strokeWidth="0.9" strokeDasharray="2,2" opacity="0.4"/>
  </svg>
);

const FlowerDoodle = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={style}>
    <circle cx="11" cy="11" r="2.5" fill="#C4A07A" opacity="0.4"/>
    {[0,60,120,180,240,300].map((a, i) => {
      const r = a * Math.PI / 180;
      return <ellipse key={i} cx={11 + 5.5*Math.cos(r)} cy={11 + 5.5*Math.sin(r)} rx="2.2" ry="1.3"
        transform={`rotate(${a}, ${11 + 5.5*Math.cos(r)}, ${11 + 5.5*Math.sin(r)})`}
        fill="#A68A6A" opacity="0.35"/>;
    })}
  </svg>
);

/* ── torn-paper top edge ── */
const TornEdge = ({ fill }: { fill: string }) => (
  <svg viewBox="0 0 220 16" preserveAspectRatio="none"
    style={{ position:"absolute", top:0, left:0, width:"100%", height:"16px", display:"block", zIndex:2 }}>
    <path d="M0,16 L0,9 Q4,3 9,7 Q14,12 20,6 Q26,1 33,7 Q40,13 48,6 Q55,0 63,6 Q71,12 79,5 Q87,0 96,6 Q105,12 113,5 Q121,0 129,6 Q137,12 145,5 Q152,0 160,6 Q168,12 176,5 Q183,0 190,5 Q197,10 204,6 Q210,2 220,7 L220,16 Z"
      fill={fill}/>
  </svg>
);

/* ── card SVG icons (sketch style) ── */
const WrittenIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#4A2A0A" : "#7A5C38";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="9" y="8" width="26" height="32" rx="2" stroke={s} strokeWidth="1.6" fill={active?"rgba(255,255,255,0.25)":"rgba(180,150,110,0.12)"}/>
      {[0,1,2].map(i=><line key={i} x1="14" y1={17+i*6} x2="30" y2={17+i*6} stroke={s} strokeWidth="1.3" strokeLinecap="round"/>)}
      <line x1="14" y1="29" x2="22" y2="29" stroke={s} strokeWidth="1.3" strokeLinecap="round"/>
      {[14,20,26].map((y,i)=><path key={i} d={`M7 ${y} Q9 ${y-2} 11 ${y} Q9 ${y+2} 7 ${y}`} stroke={s} strokeWidth="1.1" fill="none"/>)}
      <path d="M30 30 L39 21 L43 25 L34 34 Z" stroke={s} strokeWidth="1.3" fill={active?"rgba(255,255,255,0.3)":"rgba(180,150,110,0.2)"} strokeLinejoin="round"/>
      <path d="M34 34 L31 39 L36 37 Z" fill={s} opacity="0.7"/>
      <path d="M39 21 L43 25" stroke={s} strokeWidth="1.1"/>
    </svg>
  );
};

const PhotoIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#4A2A0A" : "#7A5C38";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="5" y="15" width="42" height="28" rx="3.5" stroke={s} strokeWidth="1.6" fill={active?"rgba(255,255,255,0.25)":"rgba(180,150,110,0.12)"}/>
      <path d="M16 15 L19 9 L33 9 L36 15" stroke={s} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <circle cx="26" cy="29" r="9" stroke={s} strokeWidth="1.5" fill="none"/>
      <circle cx="26" cy="29" r="5" stroke={s} strokeWidth="1.2" fill={active?"rgba(255,255,255,0.25)":"rgba(180,150,110,0.15)"}/>
      <circle cx="38" cy="20" r="2" stroke={s} strokeWidth="1.2" fill="none"/>
    </svg>
  );
};

const VideoIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#4A2A0A" : "#7A5C38";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="4" y="14" width="30" height="24" rx="3.5" stroke={s} strokeWidth="1.6" fill={active?"rgba(255,255,255,0.25)":"rgba(180,150,110,0.12)"}/>
      <path d="M34 21 L47 15 L47 37 L34 31 Z" stroke={s} strokeWidth="1.4" fill={active?"rgba(255,255,255,0.2)":"rgba(180,150,110,0.12)"} strokeLinejoin="round"/>
      <circle cx="19" cy="26" r="6" stroke={s} strokeWidth="1.3" fill="none"/>
      <polygon points="17,23 17,29 23,26" fill={s} opacity="0.65"/>
    </svg>
  );
};

const VoiceIcon = ({ active }: { active: boolean }) => {
  const s = active ? "#4A2A0A" : "#7A5C38";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="18" y="5" width="16" height="24" rx="8" stroke={s} strokeWidth="1.6" fill={active?"rgba(255,255,255,0.25)":"rgba(180,150,110,0.12)"}/>
      <line x1="22" y1="13" x2="30" y2="13" stroke={s} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="18" x2="30" y2="18" stroke={s} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M11 27 C11 38 41 38 41 27" stroke={s} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
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
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ title, description, type, date, mediaUrl }),
    });
    if (res.ok) router.push("/dashboard");
    else { setError("Failed to save. Please try again."); setLoading(false); }
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});

  const types = [
    { v:"text",  l:"Written", Icon: WrittenIcon },
    { v:"photo", l:"Photo",   Icon: PhotoIcon   },
    { v:"video", l:"Video",   Icon: VideoIcon   },
    { v:"voice", l:"Voice",   Icon: VoiceIcon   },
  ];

  const FIELD: React.CSSProperties = {
    width:"100%", background:"rgba(240,230,212,0.55)",
    border:"1.5px solid rgba(170,140,100,0.3)", borderRadius:"20px",
    padding:"15px 18px 15px 50px", fontSize:"15px", color:"#2E1A08",
    outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    backdropFilter:"blur(2px)",
  };

  return (
    <div className="min-h-screen pb-36"
      style={{ backgroundImage:"url('/dashboard-bg.jpg')", backgroundSize:"cover",
               backgroundPosition:"center", backgroundAttachment:"fixed" }}>

      {/* ─── HEADER ─── */}
      <header className="pt-16 px-6 pb-3">
        <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                    textTransform:"uppercase", marginBottom:"8px" }}>
          New Memory
        </p>
        <div style={{ position:"relative" }}>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"2.1rem", fontWeight:800,
                       color:"#140A02", lineHeight:1.18, letterSpacing:"-0.015em" }}>
            Preserve a moment<br/>forever.{" "}
            {/* hand-drawn heart */}
            <svg display="inline" width="32" height="30" viewBox="0 0 32 30" style={{ verticalAlign:"middle", marginLeft:"2px" }}>
              <path d="M16 27 C16 27 3 18 3 9 C3 5 7 2 11 3 C13 3 15 5 16 7 C17 5 19 3 21 3 C25 2 29 5 29 9 C29 18 16 27 16 27Z"
                stroke="#B87A5A" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </h1>
          {/* paper airplane doodle top-right */}
          <svg width="34" height="28" viewBox="0 0 34 28" fill="none"
            style={{ position:"absolute", top:"-4px", right:"0px", opacity:0.45 }}>
            <path d="M2 14 L32 2 L20 26 L14 16 Z" stroke="#A68A6A" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
            <path d="M14 16 L32 2" stroke="#A68A6A" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M2 14 L14 16 L20 26" stroke="#A68A6A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-5 mt-3 space-y-6">
        {error && (
          <div style={{ background:"#FFF0EE", color:"#C04040", fontSize:"13px",
                        padding:"10px 16px", borderRadius:"14px", border:"1px solid #FFCCC9" }}>
            {error}
          </div>
        )}

        {/* ─── CHOOSE TYPE ─── */}
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                      textTransform:"uppercase", marginBottom:"14px" }}>
            Choose Type
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
            {types.map(({ v, l, Icon }) => {
              const active = type === v;
              const bg = active ? "#C8943A" : "rgba(248,240,224,0.88)";
              const border = active ? "none" : "1.5px solid rgba(180,155,120,0.35)";
              return (
                <button key={v} type="button" onClick={() => setType(v)}
                  style={{ position:"relative", background:bg, border,
                            borderRadius:"0 0 14px 14px", paddingTop:"20px", paddingBottom:"12px",
                            display:"flex", flexDirection:"column", alignItems:"center", gap:"8px",
                            cursor:"pointer", overflow:"visible",
                            boxShadow: active ? "0 6px 18px rgba(160,100,10,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                            transition:"all 0.2s" }}>

                  {/* Torn top edge */}
                  <TornEdge fill={bg} />

                  {/* Tape strip on active card */}
                  {active && (
                    <div style={{ position:"absolute", top:"-10px", left:"50%",
                                  transform:"translateX(-50%) rotate(-1deg)",
                                  width:"40px", height:"16px", background:"rgba(200,168,80,0.55)",
                                  borderRadius:"3px", zIndex:3 }}/>
                  )}

                  {/* Small flower inside inactive cards */}
                  {!active && (
                    <>
                      <FlowerDoodle style={{ position:"absolute", bottom:"28px", right:"4px", opacity:0.5 }}/>
                    </>
                  )}
                  {active && (
                    <LeafDoodle style={{ position:"absolute", bottom:"26px", left:"4px", opacity:0.6 }}/>
                  )}

                  <Icon active={active}/>

                  <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.03em",
                                  color: active ? "#2E1002" : "#7A5C38",
                                  textDecoration: active ? "underline" : "none",
                                  textUnderlineOffset:"3px" }}>
                    {l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TITLE ─── */}
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                      textTransform:"uppercase", marginBottom:"9px" }}>
            Title
          </p>
          <div style={{ position:"relative" }}>
            <span style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)",
                            color:"#A68A6A", display:"flex" }}>
              {/* price-tag icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </span>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)}
              placeholder="Name this memory..." required
              style={{ ...FIELD, paddingRight:"42px" }}/>
            {/* floral right deco */}
            <FlowerDoodle style={{ position:"absolute", right:"10px", top:"50%",
                                    transform:"translateY(-50%)", opacity:0.5, pointerEvents:"none" }}/>
          </div>
        </div>

        {/* ─── DATE ─── */}
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                      textTransform:"uppercase", marginBottom:"9px" }}>
            Date
          </p>
          <div style={{ position:"relative" }} onClick={() => dateInputRef.current?.showPicker?.()}>
            <span style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)",
                            color:"#A68A6A", display:"flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            {/* Styled date display */}
            <div style={{ ...FIELD, paddingRight:"42px", cursor:"pointer", display:"flex", alignItems:"center" }}>
              <span style={{ color: date ? "#2E1A08" : "#B0997A" }}>{date ? fmtDate(date) : "Pick a date"}</span>
            </div>
            {/* Hidden real input */}
            <input ref={dateInputRef} type="date" value={date} onChange={e=>setDate(e.target.value)} required
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%",
                        border:"none", background:"transparent" }}/>
            {/* chevron + leaf deco */}
            <span style={{ position:"absolute", right:"36px", top:"50%", transform:"translateY(-50%)",
                            color:"#A68A6A", display:"flex", pointerEvents:"none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
            <LeafDoodle style={{ position:"absolute", right:"6px", top:"50%",
                                  transform:"translateY(-50%)", opacity:0.55, pointerEvents:"none" }}/>
          </div>
        </div>

        {/* ─── YOUR STORY ─── */}
        <div>
          <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                      textTransform:"uppercase", marginBottom:"9px" }}>
            Your Story
          </p>
          <div style={{ position:"relative" }}>
            {/* tape corner top-right */}
            <div style={{ position:"absolute", top:"-6px", right:"20px",
                          width:"32px", height:"12px", background:"rgba(190,160,90,0.45)",
                          borderRadius:"3px", transform:"rotate(2deg)", zIndex:1 }}/>
            <span style={{ position:"absolute", left:"16px", top:"16px", color:"#A68A6A", display:"flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </span>
            <textarea value={description} onChange={e=>setDescription(e.target.value)}
              placeholder="Write something beautiful..."
              rows={type === "text" ? 6 : 4}
              style={{ ...FIELD, paddingTop:"14px", paddingBottom:"14px", resize:"none", lineHeight:"1.65" }}/>
            {/* flower bottom-right */}
            <FlowerDoodle style={{ position:"absolute", bottom:"-8px", right:"-2px",
                                    opacity:0.5, pointerEvents:"none" }}/>
          </div>
        </div>

        {/* ─── MEDIA UPLOAD ─── */}
        {type !== "text" && (
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#B89A72", letterSpacing:"0.2em",
                        textTransform:"uppercase", marginBottom:"9px" }}>
              {type==="photo" ? "Upload Photo" : type==="video" ? "Upload Video" : "Voice Note"}
            </p>
            <div onClick={()=>fileRef.current?.click()}
              style={{ width:"100%", background:"rgba(240,230,212,0.5)",
                        border:"2px dashed rgba(170,140,100,0.4)", borderRadius:"20px",
                        display:"flex", flexDirection:"column", alignItems:"center",
                        justifyContent:"center", padding:"32px 16px", cursor:"pointer", minHeight:"130px" }}>
              {preview && type==="photo" ? (
                <img src={preview} alt="preview" style={{ maxHeight:"200px", borderRadius:"14px", objectFit:"cover", width:"100%" }}/>
              ) : preview && type==="video" ? (
                <video src={preview} controls style={{ maxHeight:"200px", borderRadius:"14px", width:"100%" }}/>
              ) : preview && type==="voice" ? (
                <audio src={preview} controls style={{ width:"100%" }}/>
              ) : (
                <>
                  <span style={{ fontSize:"42px", marginBottom:"10px" }}>
                    {type==="photo" ? "📷" : type==="video" ? "🎥" : "🎙️"}
                  </span>
                  <span style={{ fontSize:"14px", color:"#A68A6A", fontWeight:500 }}>Tap to upload</span>
                  <span style={{ fontSize:"12px", color:"#C4A07A", marginTop:"4px" }}>
                    {type==="photo" ? "JPG, PNG, HEIC" : type==="video" ? "MP4, MOV" : "MP3, M4A, WAV"}
                  </span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" onChange={handleFileChange} style={{ display:"none" }}
              accept={type==="photo" ? "image/*" : type==="video" ? "video/*" : "audio/*"}/>
          </div>
        )}

        {/* ─── SAVE MEMORY ─── */}
        <div style={{ paddingTop:"6px", paddingBottom:"8px" }}>
          <button type="submit" disabled={loading}
            style={{ width:"100%", background:"#130D06", color:"#FFFFFF", border:"none",
                      borderRadius:"999px", padding:"19px 24px", fontSize:"16px", fontWeight:600,
                      cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.75 : 1,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative", boxShadow:"0 8px 30px rgba(0,0,0,0.30)",
                      letterSpacing:"0.02em", transition:"opacity 0.2s" }}>

            {/* left botanical */}
            <span style={{ position:"absolute", left:"18px", top:"50%", transform:"translateY(-50%)",
                            display:"flex", alignItems:"center", gap:"3px", opacity:0.75 }}>
              <LeafDoodle style={{ width:"16px", height:"20px" }}/>
            </span>

            {loading ? (
              <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/>
                <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
              </svg>
            ) : (
              <span style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ color:"#D4A853", fontSize:"16px", lineHeight:1 }}>✦</span>
                Save Memory
                <span style={{ color:"#D4A853", fontSize:"16px", lineHeight:1 }}>✦</span>
              </span>
            )}

            {/* right botanical */}
            <span style={{ position:"absolute", right:"18px", top:"50%", transform:"translateY(-50%)",
                            display:"flex", alignItems:"center", gap:"3px", opacity:0.75 }}>
              <FlowerDoodle style={{ width:"18px", height:"18px" }}/>
            </span>
          </button>
        </div>
      </form>

      <Nav />
    </div>
  );
}
