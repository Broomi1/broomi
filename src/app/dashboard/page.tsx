"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#FAF6F0" }}
    >
      {/* ── BACKGROUND IMAGE (left-anchored, full height) ── */}
      <div
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/home-story-bg.jpg')",
          backgroundSize: "auto 100%",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#FAF6F0",
          zIndex: 0,
        }}
      />

      {/* ── BRAND NAME ── */}
      <div
        className="fixed z-20 select-none"
        style={{ bottom: 100, left: 18 }}
      >
        <span
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "13px",
            color: "#4B2E28",
            opacity: 0.45,
            letterSpacing: "0.12em",
          }}
        >
          broomi
        </span>
      </div>

      {/* ── STORY CONTENT (right side) ── */}
      <div
        className="fixed z-10 flex flex-col justify-center"
        style={{
          top: 0,
          right: 0,
          width: "58%",
          height: "100%",
          padding: "32px 20px 100px 8px",
          overflowY: "auto",
        }}
      >
        {/* "Meet Anna." header */}
        <p
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "clamp(18px, 5vw, 26px)",
            fontWeight: 700,
            color: "#4B2E28",
            marginBottom: "14px",
            lineHeight: 1.2,
          }}
        >
          Meet Anna.
        </p>

        {/* Opening quote mark */}
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(32px, 8vw, 52px)",
            color: "#C4A898",
            lineHeight: 0.5,
            display: "block",
            marginBottom: "4px",
          }}
        >
          "
        </span>

        {/* Story paragraphs */}
        <div
          style={{
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "clamp(13px, 3.6vw, 17px)",
            color: "#4B2E28",
            lineHeight: 1.85,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p>
            I was wandering through Montmartre, getting lost between its little
            streets, old cafés and artists, when I began noticing the locks.
          </p>
          <p style={{ fontWeight: 700, fontStyle: "italic" }}>
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
        <div
          style={{
            marginTop: "14px",
            marginBottom: "14px",
            borderLeft: "2.5px solid #C4A898",
            paddingLeft: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "clamp(13px, 3.8vw, 18px)",
              color: "#4B2E28",
              fontWeight: 700,
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            If you give me a memory,<br />
            I'll take care of it.<br />
            <span style={{ fontWeight: 400 }}>
              That's my first promise to you.
            </span>
          </p>
        </div>

        {/* Closing quote mark */}
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 7vw, 48px)",
            color: "#C4A898",
            lineHeight: 0.6,
            display: "block",
            textAlign: "right",
            paddingRight: "8px",
          }}
        >
          "
        </span>

        {/* CTA Button */}
        <Link
          href="/gallery"
          className="active:scale-95 transition-transform"
          style={{
            marginTop: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            borderRadius: "999px",
            background: "#4B2E28",
            color: "white",
            fontFamily: "var(--font-caveat), cursive",
            fontSize: "clamp(14px, 3.8vw, 18px)",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(75,46,40,0.25)",
            width: "fit-content",
            textDecoration: "none",
          }}
        >
          See my memories
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>

      <Nav />
    </div>
  );
}
