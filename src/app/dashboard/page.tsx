"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Auto-scroll functionality
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let animationFrameId: number;
    let scrollPos = 0;

    const scrollStep = () => {
      if (el) {
        scrollPos += 0.4; // Speed of auto-scroll
        el.scrollTop = scrollPos;
        
        // Stop scrolling when reached the bottom
        if (scrollPos >= el.scrollHeight - el.clientHeight) {
          return;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    // Delay auto-scroll start by 2 seconds
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scrollStep);
    }, 2000);

    // Pause scroll on touch/interaction
    const handleInteraction = () => {
      cancelAnimationFrame(animationFrameId);
      scrollPos = el.scrollTop; 
    };

    el.addEventListener("touchstart", handleInteraction, { passive: true });
    el.addEventListener("wheel", handleInteraction, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener("touchstart", handleInteraction);
      el.removeEventListener("wheel", handleInteraction);
    };
  }, [status]);

  if (status === "loading") return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF6F0]">
      
      {/* ── BACKGROUND IMAGE (Fixed, Girl on Left) ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/home-story-bg.jpg')",
          backgroundSize: "auto 100%", // Always matches screen height
          backgroundPosition: "left top", // Anchored to the left to always show the girl
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── BRAND NAME (Fixed in corner) ── */}
      <div className="fixed bottom-6 left-6 z-20 select-none">
        <span
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "18px",
            color: "#4B2E28",
            opacity: 0.6,
            letterSpacing: "0.15em",
          }}
        >
          broomi
        </span>
      </div>

      {/* ── STORY CONTENT (Fixed to Right Side, Auto-scrolling) ── */}
      <div
        ref={scrollContainerRef}
        className="absolute top-0 right-0 w-[60%] sm:w-[50%] md:w-[45%] h-full overflow-y-auto hide-scrollbar z-10"
        style={{ 
          scrollBehavior: "smooth",
          // Add a subtle gradient fade on the left edge just in case it overlaps the drawing on narrow screens
          background: "linear-gradient(to right, transparent 0%, rgba(250, 246, 240, 0.8) 15%, #FAF6F0 100%)"
        }}
      >
        <div className="pl-6 pr-4 sm:pr-8 md:pr-16 py-24 md:py-32 w-full max-w-lg ml-auto">
          
          {/* "Meet Anna." header */}
          <h1
            className="text-4xl md:text-6xl font-bold text-[#4B2E28] mb-6"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Meet Anna.
          </h1>

          {/* Opening quote mark */}
          <span
            className="block text-5xl md:text-7xl text-[#C4A898] leading-[0.5] mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "
          </span>

          {/* Story paragraphs */}
          <div
            className="space-y-6 text-xl md:text-3xl text-[#4B2E28] leading-relaxed"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <p>
              I was wandering through Montmartre, getting lost between its little
              streets, old cafés and artists, when I began noticing the locks.
            </p>
            <p className="font-bold italic text-2xl md:text-4xl">
              Names. Dates.<br />Little promises left behind.
            </p>
            <p>
              I stopped at one and wondered — <em>Who are they? Do they still
              remember this day? What happens to their story when this lock
              is gone?</em>
            </p>
            <p>For some reason, I couldn't just walk away.</p>
            <p>So I made myself a small promise:</p>
          </div>

          {/* Promise highlight */}
          <div className="my-8 border-l-[3px] border-[#C4A898] pl-5 py-1">
            <p
              className="font-bold italic text-2xl md:text-4xl text-[#4B2E28] leading-snug"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              If you give me a memory,<br />
              I'll take care of it.<br />
              <span className="font-normal text-xl md:text-3xl block mt-2">
                That's my first promise to you.
              </span>
            </p>
          </div>

          {/* Closing quote mark */}
          <span
            className="block text-right text-5xl md:text-7xl text-[#C4A898] leading-[0.5] mt-6 pr-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "
          </span>

          {/* CTA Button */}
          <div className="mt-12 mb-32 flex justify-start">
            <Link
              href="/gallery"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-[#4B2E28] text-white active:scale-95 transition-all shadow-lg hover:bg-[#3D2520]"
              style={{ textDecoration: "none" }}
            >
              <span 
                className="font-bold text-xl md:text-2xl"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                See my memories
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
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
