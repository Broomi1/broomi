"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

// Define the swipeable page order
const PAGES = ["/dashboard", "/gallery", "/profile"];

export default function SwipeRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;

      // Only treat as horizontal swipe if horizontal movement dominates
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

      const currentIndex = PAGES.findIndex(p => pathname.startsWith(p));
      if (currentIndex === -1) return;

      if (dx < 0 && currentIndex < PAGES.length - 1) {
        // Swipe left → go to next page
        router.push(PAGES[currentIndex + 1]);
      } else if (dx > 0 && currentIndex > 0) {
        // Swipe right → go to previous page
        router.push(PAGES[currentIndex - 1]);
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router]);

  return null; // Invisible component, just listens
}
