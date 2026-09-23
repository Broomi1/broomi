import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ScrollAnimationClient from "./ScrollAnimationClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session?.user;
  const isAdmin = isLoggedIn && (session.user as any).role === "admin";

  return <ScrollAnimationClient isLoggedIn={isLoggedIn} isAdmin={isAdmin} />;
}
