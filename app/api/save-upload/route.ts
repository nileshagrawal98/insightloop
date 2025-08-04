import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, fileUrl } = body;

    if (!title || !fileUrl)
      return NextResponse.json(
        { error: "Mandatory fields are missing." },
        { status: 400 }
      );

    const session = await getAuthSession();
    console.log("session: ", session);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const doc = await prisma.document.create({
      data: {
        title,
        fileUrl,
        userId: session.user.id,
      },
    });

    console.log("doc: ", doc);
    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
