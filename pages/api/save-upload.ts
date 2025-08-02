import { getAuthApiSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.status(405).send("Not Allowed");

    console.log("req.body: ", req.body);
    const { title, fileUrl } = req.body;
    if (!title || !fileUrl)
      return res.status(400).json({ error: "Mandatory fields are missing." });

    const session = await getAuthApiSession(req, res);
    console.log("session: ", session);
    if (!session?.user?.id)
      return res.status(403).json({ error: "Unauthorized" });

    const doc = await prisma.document.create({
      data: {
        title,
        fileUrl,
        userId: session.user.id,
      },
    });

    console.log("doc: ", doc);
    return res.status(200).json(doc);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
