import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId");
  if (!docId) {
    return NextResponse.json({ error: "Missing docId" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      documentId: docId,
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  messages.reverse();

  const formattedMessages = messages.map((msg) => ({
    role: msg.role !== "ai" ? "user" : "ai",
    content: msg.content,
    createdAt: msg.createdAt,
  }));

  return NextResponse.json({ messages: formattedMessages });
}
