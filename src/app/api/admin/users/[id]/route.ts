import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/users/[id] — toggle active
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { isActive } = await req.json();
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { isActive },
  });

  return NextResponse.json({ id: user.id, isActive: user.isActive });
}
