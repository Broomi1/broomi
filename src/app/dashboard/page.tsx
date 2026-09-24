"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeAnimation from "@/components/HomeAnimation";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  // Steps: "popup" → "animation" → "story"
  const [step, setStep] = useState<"popup" | "animation" | "story">("popup");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return null;

  // ── STEP 1: ADD MEMORY POPUP ──
  if (step === "popup") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-5">
        <style>{`
          @keyframes popIn {
            0%   { opacity: 0; transform: scale(0.88); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div
          className="bg-[#FAF6F0] rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
          style={{ animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        >
          <div className="text-6xl mb-4">📸</div>
          <h2
            className="text-3xl font-bold text-[#4B2E28] mb-2"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Add a Memory
          </h2>
          <p className="text-[#7A6058] mb-8 leading-relaxed text-sm">
            Capture a moment worth keeping. Tap below to add your next memory.
          </p>
          <Link
            href="/memories/new"
            className="inline-block w-full py-3.5 bg-[#4B2E28] text-white font-bold rounded-full text-lg shadow-lg active:scale-95 transition-transform"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            Add Memory
          </Link>
          <button
            onClick={() => {
              setStep("animation");
              window.scrollTo(0, 0);
            }}
            className="mt-4 block w-full text-[#7A6058] text-sm font-medium underline underline-offset-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    );
  }

  // ── STEP 2: HOME ANIMATION (after popup) ──
  if (step === "animation") {
    return (
      <HomeAnimation
        onComplete={() => {
          setStep("story");
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // ── STEP 3: STORY / DASHBOARD ──
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF6F0]">

      {/* ── BACKGROUND IMAGE (Fixed, Girl on Left) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/home-story-bg.jpg')",
          backgroundSize: "auto 100%",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── RIGHT SIDE FADE ── */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          background: "linear-gradient(to left, rgba(250,246,240,1) 0%, rgba(250,246,240,0.88) 28%, rgba(250,246,240,0) 65%)"
        }}
      />

      {/* ── BRANDING ── */}
      <div className="fixed bottom-6 left-5 z-20 select-none opacity-45">
        <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "15px", color: "#4B2E28", letterSpacing: "0.15em", fontWeight: 700 }}>
          broomi
        </span>
      </div>

      {/* ── STORY CONTENT ── */}
      <div
        className="absolute top-0 right-0 h-full z-10 overflow-y-auto"
        style={{
          width: "58%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          animation: "fadeInStory 0.8s ease forwards",
        }}
      >
        <style>{`
          @keyframes fadeInStory {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="pl-3 pr-4 sm:pr-8 py-10 relative">

          <div className="absolute top-6 right-3 text-xl select-none pointer-events-none opacity-70 rotate-12">⭐</div>

          <h1
            className="font-bold text-[#4B2E28] mb-3 leading-tight"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "clamp(22px, 6vw, 32px)" }}
          >
            Meet Anna.
          </h1>

          <span
            className="block text-[#C4A898] leading-none mb-2"
            style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 7vw, 44px)", lineHeight: 0.6 }}
          >
            "
          </span>

          <div
            className="text-[#5F4D4A] leading-snug flex flex-col gap-3"
            style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "clamp(13px, 3.4vw, 16px)" }}
          >
            <p>
              I was wandering through Montmartre, getting lost between its little
              streets, old cafés and artists, when I began noticing the locks.
            </p>

            <p className="font-bold italic text-[#4B2E28] pl-3 border-l-2 border-[#C4A898]"
               style={{ fontSize: "clamp(13px, 3.6vw, 17px)" }}>
              Names. Dates.<br />Little promises left behind.
            </p>

            <div className="flex justify-end pr-2 select-none pointer-events-none">
              <span className="text-base opacity-60 -rotate-12">🔑</span>
            </div>

            <p>
              I stopped at one and wondered —{" "}
              <span className="opacity-75 italic">
                Who are they? Do they still remember this day?
                What happens to their story when this lock is gone?
              </span>
            </p>

            <p>For some reason, I couldn't just walk away.</p>
            <p>So I made myself a small promise:</p>
          </div>

          <div
            className="my-4 px-4 py-4 rounded-2xl border border-[#E8D5C8]/60 relative"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)" }}
          >
            <span className="absolute -top-3 -right-2 text-lg select-none pointer-events-none rotate-6">🌿</span>
            <p
              className="font-bold italic text-[#4B2E28] leading-snug"
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "clamp(13px, 3.8vw, 17px)" }}
            >
              If you give me a memory,<br />
              I'll take care of it.
              <br />
              <span className="font-normal opacity-75 not-italic" style={{ fontSize: "clamp(12px, 3.3vw, 15px)" }}>
                That's my first promise to you.
              </span>
            </p>
          </div>

          <div className="text-right pr-2 mb-4">
            <span
              className="text-[#C4A898] leading-none"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 6vw, 38px)", lineHeight: 0.6 }}
            >
              "
            </span>
          </div>

          <div className="flex gap-2 mb-5 pl-1 select-none pointer-events-none">
            <span className="text-sm opacity-50">♡</span>
            <span className="text-sm opacity-30">♡</span>
            <span className="text-sm opacity-20">♡</span>
          </div>

          <Link
            href="/gallery"
            className="relative group flex items-center justify-center overflow-hidden rounded-full p-[2px] w-fit active:scale-95 transition-all"
            style={{ textDecoration: "none" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4B2E28] via-[#8A5A44] to-[#4B2E28] rounded-full opacity-80" />
            <div className="relative flex items-center gap-2 px-6 py-2.5 bg-[#FAF6F0] rounded-full">
              <span
                className="font-bold text-[#4B2E28]"
                style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "clamp(14px, 4vw, 18px)" }}
              >
                Step inside
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B2E28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </div>
          </Link>

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
