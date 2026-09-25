import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If already logged in, skip animation and go straight to dashboard
  if (session?.user) {
    if ((session.user as any).role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  // Go straight to login
  redirect("/login");
}
