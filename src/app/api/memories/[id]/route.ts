import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE /api/memories/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const memory = await prisma.memory.findUnique({ where: { id: params.id } });

  if (!memory || memory.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.memory.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

// PUT /api/memories/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const memory = await prisma.memory.findUnique({ where: { id: params.id } });

  if (!memory || memory.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { title, description, type, date, mediaUrl } = await req.json();
  const updated = await prisma.memory.update({
    where: { id: params.id },
    data: { title, description, type, date: date ? new Date(date) : undefined, mediaUrl },
  });

  return NextResponse.json(updated);
}
