import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/memories - fetch current user's memories
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const memories = await prisma.memory.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(memories);
}

// POST /api/memories - create a new memory
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { title, description, type, date, mediaUrl } = await req.json();

  if (!title || !type) {
    return NextResponse.json({ error: "Title and type are required" }, { status: 400 });
  }

  const memory = await prisma.memory.create({
    data: {
      userId,
      title,
      description,
      type,
      date: new Date(date),
      mediaUrl,
    },
  });

  return NextResponse.json(memory, { status: 201 });
}
