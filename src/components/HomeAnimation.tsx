"use client";

import { useEffect, useRef, useState } from "react";

interface HomeAnimationProps {
  onComplete?: () => void;
}

export default function HomeAnimation({ onComplete }: HomeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCount = 183;
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Preload + pre-decode all frames
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(frameCount);
    let loaded = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/homeimages/ezgif-frame-${paddedIndex}.jpg`;
      img.decoding = "async";
      const idx = i - 1;
      const done = () => {
        loadedImages[idx] = img;
        loaded++;
        setImagesLoaded(loaded);
        if (loaded === frameCount) setImages([...loadedImages]);
      };
      img.decode().then(done).catch(done);
    }
  }, []);

  // Canvas render loop
  useEffect(() => {
    if (imagesLoaded < frameCount) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img) return;
      const scale = Math.max(window.innerWidth / img.width, window.innerHeight / img.height);
      const x = window.innerWidth / 2 - (img.width / 2) * scale;
      const y = window.innerHeight / 2 - (img.height / 2) * scale;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    renderFrame(0);

    let animFrameId: number;

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
      const frameIndex = Math.min(frameCount - 1, Math.floor(fraction * frameCount));
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => renderFrame(frameIndex));
    };

    const handleResize = () => {
      resize();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [images, imagesLoaded]);

  // Detect end of scroll
  const [isAtEnd, setIsAtEnd] = useState(false);
  useEffect(() => {
    const check = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsAtEnd(maxScroll > 0 && document.documentElement.scrollTop >= maxScroll - 60);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <div style={{ height: "500vh", backgroundColor: "#000" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="sticky top-0 left-0 w-full overflow-hidden" style={{ height: "100dvh" }}>

        {/* Loading bar */}
        {imagesLoaded < frameCount && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black">
            <div className="flex flex-col items-center gap-3">
              <div className="w-52 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${(imagesLoaded / frameCount) * 100}%` }}
                />
              </div>
              <span className="text-white/50 text-xs tracking-[0.3em] uppercase">
                Loading
              </span>
            </div>
          </div>
        )}

        {/* Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Dark overlay at end */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-700"
          style={{ opacity: isAtEnd ? 0.55 : 0 }}
        />

        {/* End CTA */}
        {isAtEnd && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ animation: "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards" }}
          >
            <h1
              className="text-white font-bold mb-10 drop-shadow-xl"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: "clamp(44px, 10vw, 72px)",
                letterSpacing: "-0.01em",
              }}
            >
              broomi
            </h1>
            <button
              onClick={onComplete}
              className="px-10 py-3.5 bg-white text-black font-semibold rounded-full text-lg tracking-tight active:scale-95 transition-all"
              style={{
                boxShadow: "0 0 40px rgba(255,255,255,0.35), 0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Step Inside →
            </button>
          </div>
        )}

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
          style={{ opacity: isAtEnd ? 0 : 0.55 }}
        >
          <span className="text-white text-xs tracking-[0.25em] uppercase">Scroll</span>
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
