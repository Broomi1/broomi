"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);


  if (status === "loading") return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF6F0]">
      
      {/* ── BACKGROUND IMAGE (Fixed, Girl on Left) ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/home-story-bg.jpg')",
          backgroundSize: "auto 100%", // Always matches screen height
          backgroundPosition: "left top", 
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── CINEMATIC VIGNETTE OVERLAY (Subtle fade from right) ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: "linear-gradient(to left, rgba(250,246,240,1) 0%, rgba(250,246,240,0.85) 30%, rgba(250,246,240,0) 70%)"
        }}
      />

      {/* ── BRANDING ── */}
      <div className="fixed top-8 right-8 z-20 select-none flex flex-col items-end opacity-50">
        <span
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "22px",
            color: "#4B2E28",
            letterSpacing: "0.15em",
            fontWeight: 700
          }}
        >
          broomi
        </span>
        <div className="w-12 h-[1px] bg-[#4B2E28] mt-1 opacity-50" />
      </div>

      {/* ── STORY CONTENT (Fixed to Right Side, Still) ── */}
      <div
        className="absolute top-0 right-0 w-[60%] sm:w-[55%] md:w-[48%] h-full flex flex-col justify-center z-10"
      >
        <div className="pl-4 pr-6 sm:pr-12 md:pr-20 w-full max-w-xl ml-auto py-12">
          
          <div className="relative">
            {/* Decorative background flourish */}
            <div className="absolute -left-8 -top-8 text-[#E8D5C8] opacity-30 pointer-events-none" style={{ fontFamily: "Georgia", fontSize: "140px", lineHeight: 0.5 }}>
              "
            </div>
            
            <h1
              className="text-5xl md:text-7xl font-bold text-[#4B2E28] mb-12 tracking-tight drop-shadow-sm"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              Meet Anna.
            </h1>
          </div>

          {/* Story paragraphs */}
          <div
            className="space-y-8 text-[1.4rem] md:text-[1.8rem] text-[#5F4D4A] leading-relaxed relative z-10"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <p className="opacity-90">
              I was wandering through Montmartre, getting lost between its little
              streets, old cafés and artists, when I began noticing the locks.
            </p>
            
            {/* Emphasized thought */}
            <p className="font-bold italic text-[1.6rem] md:text-[2.2rem] text-[#4B2E28] pl-4 border-l-2 border-[#E8D5C8]">
              Names. Dates.<br />Little promises left behind.
            </p>
            
            <p className="opacity-90">
              I stopped at one and wondered — <span className="opacity-70">Who are they? Do they still
              remember this day? What happens to their story when this lock
              is gone?</span>
            </p>
            
            <p className="opacity-90">For some reason, I couldn't just walk away.</p>
            
            <p className="opacity-90">So I made myself a small promise:</p>
          </div>

          {/* Magical Promise Highlight */}
          <div className="my-14 relative group">
            <div className="absolute inset-0 bg-[#4B2E28] opacity-5 blur-xl rounded-full transform group-hover:scale-105 transition-transform duration-700"></div>
            <div className="relative p-6 md:p-8 rounded-[2rem] border border-[#E8D5C8]/40"
                 style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)" }}>
              <p
                className="font-bold text-[1.8rem] md:text-[2.4rem] text-[#4B2E28] leading-snug text-center"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                If you give me a memory,<br />
                <span className="italic">I'll take care of it.</span>
                <br />
                <span className="font-normal text-[1.4rem] md:text-[1.8rem] block mt-4 opacity-70">
                  That's my first promise to you.
                </span>
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/gallery"
              className="relative group flex items-center justify-center overflow-hidden rounded-full p-[2px]"
              style={{ textDecoration: "none" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4B2E28] via-[#8A5A44] to-[#4B2E28] rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3 px-10 py-4 bg-[#FAF6F0] rounded-full group-active:scale-[0.98] transition-all">
                <span 
                  className="font-bold text-2xl md:text-3xl text-[#4B2E28]"
                  style={{ fontFamily: "var(--font-caveat), cursive" }}
                >
                  Step inside
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* ── HIDE SCROLLBAR STYLES ── */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
