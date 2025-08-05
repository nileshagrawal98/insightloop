import { getAuthSession } from "@/lib/auth";
import extractTextFromPdf from "@/lib/extractTextFromPdf";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const MAX_CHARS = 12000;

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
    const fileResponse = await fetch(document.fileUrl);
    const fileBuffer = await fileResponse.arrayBuffer();

    const extractedText = await extractTextFromPdf(Buffer.from(fileBuffer));
    console.log("extractedText: ", extractedText);

    if (!extractedText || extractedText.length < 200) {
      return NextResponse.json(
        { error: "The document is too short to summarize." },
        { status: 400 }
      );
    }

    if (extractedText.length > MAX_CHARS) {
      return NextResponse.json(
        {
          error: `Document too large to summarize (limit is ${MAX_CHARS} characters).`,
        },
        { status: 413 }
      );
    }

    const prompt = `
      You are an expert document summarizer.

      Summarize the following content into a concise overview with key bullet points. Avoid repetition and ensure clarity.

      Document:
      "${extractedText}"
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes documents.",
        },
        { role: "user", content: prompt },
      ],
    });

    console.log("completion: ", completion);
    const summary = completion.choices[0].message.content;
    console.log("summary: ", summary);

    const updateDoc = await prisma.document.update({
      where: { id: docId },
      data: { summary },
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
