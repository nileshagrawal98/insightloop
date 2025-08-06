import ChatWithDoc from "@/components/ChatWithDoc";
import NotesEditor from "@/components/NotesEditor";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DocPage({
  params: paramsPromise,
}: {
  params: { docId: string };
}) {
  const params = await paramsPromise;
  const session = await getAuthSession();

  if (!session || !session.user) return notFound();

  const document = await prisma.document.findFirst({
    where: { id: params.docId },
    include: { sharedWith: true },
  });

  if (!document) return notFound();

  const isOwner = document.userId === session.user.id;
  const isSharedWith = document.sharedWith.some(
    ({ email }) => email === session.user.email
  );

  if (!isOwner && !isSharedWith) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You don’t have permission to view this document. Ask the owner to
          share access with your email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{document.title}</h1>
        <p className="text-sm text-muted-foreground">
          Uploaded: {new Date(document.createdAt).toLocaleString()}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <pre className="text-muted-foreground text-wrap">
          {document.summary || "Summary not found. Upload your file again."}
        </pre>
      </div>

      {document.summary ? (
        <>
          <ChatWithDoc docId={params.docId} />

          <div className="my-6 border-t pt-6">
            <h2 className="text-xl font-semibold mb-2">Your Notes</h2>
            <NotesEditor docId={params.docId} />
          </div>
        </>
      ) : null}
    </div>
  );
}
