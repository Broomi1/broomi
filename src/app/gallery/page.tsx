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

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

/* ── Floating space decoration SVGs ── */
const Astronaut = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <ellipse cx="40" cy="38" rx="22" ry="25" fill="white" stroke="#DDD" strokeWidth="1"/>
    <circle cx="40" cy="32" r="15" fill="#6B4FA0"/>
    <circle cx="40" cy="32" r="11" fill="#A8C4F0" opacity="0.8"/>
    <circle cx="36" cy="29" r="3" fill="white" opacity="0.6"/>
    <rect x="18" y="40" width="8" height="22" rx="4" fill="white" stroke="#DDD" strokeWidth="1"/>
    <rect x="54" y="40" width="8" height="22" rx="4" fill="white" stroke="#DDD" strokeWidth="1"/>
    <rect x="24" y="62" width="32" height="24" rx="6" fill="white" stroke="#DDD" strokeWidth="1"/>
    <rect x="30" y="86" width="8" height="14" rx="4" fill="white" stroke="#DDD" strokeWidth="1"/>
    <rect x="42" y="86" width="8" height="14" rx="4" fill="white" stroke="#DDD" strokeWidth="1"/>
    <rect x="28" y="48" width="10" height="6" rx="2" fill="#7EC8E3" opacity="0.8"/>
  </svg>
);

const Saturn = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 60" fill="none" style={style}>
    <ellipse cx="40" cy="30" rx="18" ry="18" fill="#D4A44C"/>
    <ellipse cx="40" cy="30" rx="18" ry="18" fill="url(#saturnGrad)"/>
    <ellipse cx="40" cy="30" rx="34" ry="8" fill="none" stroke="#C8894A" strokeWidth="3" opacity="0.8"/>
    <ellipse cx="40" cy="30" rx="30" ry="6" fill="none" stroke="#E0B060" strokeWidth="2" opacity="0.6"/>
    <defs>
      <radialGradient id="saturnGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#F0C878"/>
        <stop offset="100%" stopColor="#C8894A"/>
      </radialGradient>
    </defs>
  </svg>
);

const Planet = ({ color1, color2, style }: { color1: string; color2: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" fill="none" style={style}>
    <circle cx="30" cy="30" r="25" fill={color1}/>
    <ellipse cx="25" cy="22" rx="10" ry="6" fill={color2} opacity="0.5"/>
    <ellipse cx="35" cy="38" rx="8" ry="4" fill={color2} opacity="0.35"/>
  </svg>
);

const Star = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 20 20" fill="#F5C842" style={style}>
    <polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/>
  </svg>
);

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/memories")
        .then(r => r.json())
        .then(data => { setMemories(data); setLoading(false); });
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/memories/${id}`, { method: "DELETE" });
    setMemories(m => m.filter(x => x.id !== id));
    setDeletingId(null);
    setConfirmId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg,#C8B4E8 0%,#D4B8E8 40%,#E8C4C4 100%)" }}>
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"/>
      </div>
    );
  }

  const filteredMemories = filter === "all" ? memories : memories.filter(m => m.type === filter);

  return (
    <div className="min-h-screen pb-36 relative overflow-hidden font-sans"
      style={{ background: "linear-gradient(180deg,#BFB0E0 0%,#D0B8E8 25%,#DFC0DC 55%,#EEC8C0 85%,#F0C8B8 100%)" }}>

      {/* ── FLOATING SPACE DECORATIONS ── */}
      {/* Top right astronaut */}
      <Astronaut style={{ position:"absolute", top:"30px", right:"8px", width:"90px", opacity:0.95, zIndex:1, transform:"rotate(15deg)" }}/>
      {/* Purple planet top right */}
      <Planet color1="#9B85CC" color2="#7B65AC" style={{ position:"absolute", top:"60px", right:"108px", width:"40px", zIndex:1 }}/>
      {/* Saturn mid right */}
      <Saturn style={{ position:"absolute", top:"180px", right:"-10px", width:"80px", zIndex:1, opacity:0.85 }}/>
      {/* Bottom left astronaut */}
      <Astronaut style={{ position:"absolute", bottom:"90px", left:"-10px", width:"100px", opacity:0.90, zIndex:1, transform:"rotate(-20deg) scaleX(-1)" }}/>
      {/* Bottom right Saturn */}
      <Saturn style={{ position:"absolute", bottom:"70px", right:"-15px", width:"90px", zIndex:1, opacity:0.80 }}/>
      {/* Earth-like planet */}
      <Planet color1="#70B870" color2="#4A9850" style={{ position:"absolute", top:"300px", left:"-5px", width:"50px", zIndex:1, opacity:0.85 }}/>
      {/* Stars scattered */}
      <Star style={{ position:"absolute", top:"55px",  left:"30px",  width:"18px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"100px", left:"55px",  width:"12px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"140px", right:"130px",width:"14px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"200px", left:"15px",  width:"16px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"250px", right:"18px", width:"11px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"400px", left:"10px",  width:"13px", zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"460px", right:"15px", width:"15px", zIndex:1 }}/>
      <Star style={{ position:"absolute", bottom:"220px",left:"60px",width:"12px", zIndex:1 }}/>
      <Star style={{ position:"absolute", bottom:"160px",right:"55px",width:"14px",zIndex:1 }}/>
      <Star style={{ position:"absolute", bottom:"110px",left:"30px",width:"16px",zIndex:1 }}/>
      <Star style={{ position:"absolute", top:"85px", right:"55px",  width:"10px", zIndex:1 }}/>

      {/* ── HEADER ── */}
      <header className="pt-20 px-6 pb-4 relative z-10">
        <p className="text-[11px] font-bold text-[#5A3E7A] uppercase tracking-[0.18em] mb-1">
          YOUR SPACE
        </p>
        <h1 className="text-[2.4rem] font-bold text-[#1A0A2E] leading-tight mb-1"
          style={{ fontFamily:"Georgia, serif", letterSpacing:"-0.02em" }}>
          Gallery <span className="text-[2rem]">🖼️</span>
        </h1>
        <p className="text-[#4A3060] text-[15px] font-medium">
          {memories.length} {memories.length === 1 ? "memory" : "memories"} collected.
        </p>
      </header>

      {/* ── FILTER TABS ── */}
      <div className="px-6 mb-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[
            { v:"all",   l:"All",   icon:"✦" },
            { v:"photo", l:"Photo", icon:"📷" },
            { v:"video", l:"Video", icon:"🎥" },
            { v:"voice", l:"Voice", icon:"🎙️" },
            { v:"text",  l:"Text",  icon:"✍️" },
          ].map(({ v, l, icon }) => (
            <button key={v} onClick={() => setFilter(v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold shrink-0 transition-all"
              style={{
                background: filter === v ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                color: filter === v ? "#4A2D7A" : "#6B4A8A",
                boxShadow: filter === v ? "0 4px 12px rgba(100,60,150,0.18)" : "none",
                border: filter === v ? "1.5px solid rgba(160,120,200,0.4)" : "1.5px solid rgba(255,255,255,0.3)",
              }}>
              <span>{icon}</span>{l}
            </button>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="px-6 relative z-10">
        <p className="text-[10px] font-bold text-[#5A3E7A] uppercase tracking-[0.18em] mb-5">
          TIMELINE
        </p>

        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-[#5A3E7A] text-[16px] font-semibold">No memories here yet!</p>
            <p className="text-[#7A5E9A] text-[13px] mt-1">Add your first cosmic memory.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-5 bottom-4 w-[1.5px]"
              style={{ background:"linear-gradient(180deg,rgba(160,120,200,0.6) 0%,rgba(160,120,200,0.1) 100%)" }}/>

            <div className="space-y-5">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 w-4 h-4 rounded-full flex items-center justify-center z-10"
                    style={{ background:"linear-gradient(135deg,#E8C842,#D4A020)", boxShadow:"0 2px 8px rgba(212,160,32,0.5)" }}>
                    <div className="w-2 h-2 rounded-full bg-white opacity-70"/>
                  </div>

                  {/* Memory Card */}
                  <div className="bg-white/92 backdrop-blur-md rounded-[22px] overflow-hidden shadow-sm"
                    style={{ border:"1px solid rgba(200,180,240,0.35)" }}>

                    {/* Card header */}
                    <div className="px-5 pt-5 pb-3 flex items-start gap-3">
                      {/* Type avatar */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background:"linear-gradient(135deg,#9B85CC,#7B65AC)" }}>
                        <span className="text-[16px]">
                          {memory.type === "photo" ? "📷" : memory.type === "video" ? "🎥" : memory.type === "voice" ? "🎙️" : "✍️"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[#1A0A2E] text-[16px] leading-tight">{memory.title}</h3>
                          <span className="text-[12px] text-[#8A8A9A] font-medium shrink-0">{formatFullDate(memory.date)}</span>
                        </div>
                        {memory.description && (
                          <p className="text-[13px] text-[#6A6A8A] mt-0.5 line-clamp-2">{memory.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Media */}
                    {memory.mediaUrl && memory.type === "photo" && (
                      <div className="px-5 pb-3">
                        <img src={memory.mediaUrl} alt={memory.title}
                          className="w-full h-52 object-cover rounded-[14px]"
                          style={{ border:"1px solid rgba(200,180,240,0.3)" }}/>
                      </div>
                    )}
                    {memory.mediaUrl && memory.type === "video" && (
                      <div className="px-5 pb-3">
                        <video src={memory.mediaUrl} controls className="w-full h-52 object-cover rounded-[14px]"/>
                      </div>
                    )}
                    {memory.mediaUrl && memory.type === "voice" && (
                      <div className="px-5 pb-3">
                        <audio src={memory.mediaUrl} controls className="w-full"/>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-5 pb-4 flex items-center gap-4">
                      <Link href={`/memories/${memory.id}/edit`}
                        className="text-[15px] font-semibold"
                        style={{ color:"#C28C3A" }}>
                        Edit
                      </Link>
                      {confirmId === memory.id ? (
                        <span className="flex gap-3 text-[15px]">
                          <button onClick={() => handleDelete(memory.id)}
                            className="font-semibold text-red-500" disabled={deletingId === memory.id}>
                            {deletingId === memory.id ? "..." : "Confirm"}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="text-[#9A9AB0] font-medium">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmId(memory.id)}
                          className="text-[15px] font-medium text-[#9A9AB0]">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbar::-webkit-scrollbar { display:none; }
        .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}}/>

      <Nav />
    </div>
  );
}
