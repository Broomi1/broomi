"use client";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useRouter } from "next/navigation";

export default function ScrollAnimationClient({ isLoggedIn, isAdmin }: { isLoggedIn: boolean, isAdmin: boolean }) {
  const router = useRouter();

  return (
    <ScrollAnimation 
      buttonText={isLoggedIn ? "Enter Dashboard" : "Enter Now"}
      onComplete={() => {
        if (isAdmin) {
          router.push("/admin");
        } else if (isLoggedIn) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }}
    />
  );
}
