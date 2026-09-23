"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  
  const frameCount = 240;
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(3, "0");
      img.src = `/heroimages/ezgif-frame-${paddedIndex}.jpg`;
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
      };
      // Keep reference to trigger onload
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    if (imagesLoaded < frameCount) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img) return;
      
      // Calculate object-cover dimensions
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    
    // Initial render
    renderFrame(0);
    
    let animationFrameId: number;
    
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate which frame to show
      const scrollFraction = scrollTop / maxScroll;
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => renderFrame(frameIndex));
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      handleScroll(); // re-render current frame
    });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [images, imagesLoaded]);

  // If we scroll to the very bottom, show a button to enter
  const [isAtEnd, setIsAtEnd] = useState(false);
  useEffect(() => {
    const checkScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      if (document.documentElement.scrollTop >= maxScroll - 50) {
        setIsAtEnd(true);
      } else {
        setIsAtEnd(false);
      }
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div style={{ height: "400vh", backgroundColor: "#000" }}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {imagesLoaded < frameCount && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-50 bg-[#1a1514]">
            <div className="flex flex-col items-center">
               <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-3">
                 <div className="h-full bg-white transition-all duration-300" style={{ width: `${(imagesLoaded / frameCount) * 100}%` }} />
               </div>
               <span className="text-sm font-medium opacity-70 tracking-widest uppercase">Loading Experience</span>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
        
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none" 
          style={{ opacity: isAtEnd ? 0.6 : 0 }} 
        />
        
        <div 
          className={`absolute bottom-24 left-0 right-0 flex flex-col items-center justify-center transition-all duration-1000 ${isAtEnd ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}`}
        >
          <h1 className="text-white text-6xl font-bold mb-8 drop-shadow-xl" style={{ fontFamily: "var(--font-caveat), cursive" }}>MemoryTap</h1>
          <button
            onClick={() => router.push("/login")}
            className="px-10 py-3.5 bg-white text-black font-semibold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95 transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]"
          >
            Enter Now
          </button>
        </div>
        
        {/* Scroll indicator when not at end */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-500 ${isAtEnd ? 'opacity-0' : 'opacity-60'}`}>
           <span className="text-white text-xs tracking-widest uppercase mb-2">Scroll</span>
           <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}
