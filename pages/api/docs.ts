import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const documents = await prisma.document.findMany({
      include: {
        user: true,
        notes: true,
        sharedWith: true,
      },
    });
    return res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
