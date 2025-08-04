import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const { docId } = body || {};
  console.log("docId: ", docId);
  if (!docId)
    return NextResponse.json({ error: "Missing docId" }, { status: 400 });

  const document = await prisma.document.findUnique({
    where: { id: docId },
  });
  console.log("document: ", document);
  if (!document)
    return NextResponse.json({ error: "Document not found" }, { status: 404 });

  try {
    // TODO: Summarize using chatgpt
    const dummySummary = "Dummy Summary from chatgpt";
    console.log("dummySummary: ", dummySummary);

    const updateDoc = await prisma.document.update({
      where: { id: docId },
      data: { summary: dummySummary },
    });

    return NextResponse.json(updateDoc, { status: 200 });
  } catch (err) {
    console.error("Summarization error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
