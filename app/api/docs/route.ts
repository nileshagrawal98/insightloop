import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        user: true,
        notes: true,
        sharedWith: true,
      },
    });
    return NextResponse.json(documents, { status: 200 });
  } catch (err) {
    console.error("Error fetching documents:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
