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
        scrollPos += 0.3; // Speed of auto-scroll
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
      // Optional: Update scrollPos to current manual scroll position to resume correctly if needed
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
    <div className="min-h-screen relative flex flex-col md:flex-row bg-[#FAF6F0] overflow-hidden">
      
      {/* ── BACKGROUND IMAGE (Responsive) ── */}
      <div 
        className="w-full h-[40vh] md:h-screen md:w-[45%] relative shrink-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/home-story-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "left top",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#FAF6F0",
          }}
        />
        {/* Gradient fade to seamlessly blend image with text on mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FAF6F0] md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FAF6F0] hidden md:block" />
      </div>

      {/* ── BRAND NAME (Fixed in corner) ── */}
      <div className="absolute top-6 right-6 z-20 select-none">
        <span
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "16px",
            color: "#4B2E28",
            opacity: 0.6,
            letterSpacing: "0.15em",
          }}
        >
          broomi
        </span>
      </div>

      {/* ── STORY CONTENT (Auto-scrolling) ── */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full md:w-[55%] h-[60vh] md:h-screen overflow-y-auto px-6 py-8 md:p-16 hide-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-2xl mx-auto pb-32 pt-4 md:pt-20">
          
          {/* "Meet Anna." header */}
          <h1
            className="text-5xl md:text-7xl font-bold text-[#4B2E28] mb-8"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Meet Anna.
          </h1>

          {/* Opening quote mark */}
          <span
            className="block text-6xl md:text-8xl text-[#C4A898] leading-[0.5] mb-6"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "
          </span>

          {/* Story paragraphs */}
          <div
            className="space-y-8 text-2xl md:text-3xl text-[#4B2E28] leading-relaxed"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <p>
              I was wandering through Montmartre, getting lost between its little
              streets, old cafés and artists, when I began noticing the locks.
            </p>
            <p className="font-bold italic text-3xl md:text-4xl">
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
          <div className="my-10 border-l-4 border-[#C4A898] pl-6 py-2">
            <p
              className="font-bold italic text-3xl md:text-4xl text-[#4B2E28] leading-snug"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              If you give me a memory,<br />
              I'll take care of it.<br />
              <span className="font-normal text-2xl md:text-3xl block mt-3">
                That's my first promise to you.
              </span>
            </p>
          </div>

          {/* Closing quote mark */}
          <span
            className="block text-right text-6xl md:text-8xl text-[#C4A898] leading-[0.5] mt-8 pr-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            "
          </span>

          {/* CTA Button */}
          <div className="mt-16 flex justify-center md:justify-start">
            <Link
              href="/gallery"
              className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#4B2E28] text-white active:scale-95 transition-all shadow-lg hover:shadow-xl hover:bg-[#3D2520]"
              style={{ textDecoration: "none" }}
            >
              <span 
                className="font-bold text-2xl md:text-3xl"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                See my memories
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
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
