import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import ScrollAnimation from "@/components/ScrollAnimation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If already logged in, go straight to dashboard or admin
  if (session?.user) {
    if ((session.user as any).role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  // Otherwise show the landing page animation
  return <ScrollAnimation />;
}
