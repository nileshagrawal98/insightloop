import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthSession } from "@/lib/auth";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  documentUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async () => {
      const session = await getAuthSession();
      if (!session?.user) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete by userId:", metadata.userId);
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
