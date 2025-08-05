import { getAuthSession } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { docId, message } = (await req.json()) || {};
  console.log("message: ", message);
  console.log("docId: ", docId);
  if (!docId) {
    return NextResponse.json({ error: "Missing docId" }, { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id: docId },
    include: { sharedWith: true, user: true },
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

  if (!document.summary) {
    return NextResponse.json(
      { error: "Pdf summary not present." },
      { status: 400 }
    );
  }

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an assistant helping users understand a document. Here is the document summary:\n\n${document.summary}`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  console.log("aiResponse: ", aiResponse);
  const aiMessage = aiResponse.choices[0].message.content;

  return NextResponse.json({ response: aiMessage });
}
