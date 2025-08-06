import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { docId, note } = await req.json();
  if (!docId || !note) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const document = await prisma.document.findUnique({
    where: { id: docId },
    include: { user: true, sharedWith: true },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const isOwner = document.userId === session.user.id;
  const hasSharedAccess = document.sharedWith.some(
    ({ email }) => email === session.user.email
  );

  if (!isOwner && !hasSharedAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newNote = await prisma.note.create({
    data: {
      content: note,
      documentId: docId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ note: newNote });
}

export async function GET(req: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId");
  if (!docId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const notes = await prisma.note.findMany({
    where: { documentId: docId, userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ notes });
}
