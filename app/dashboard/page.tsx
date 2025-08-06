import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getAuthSession();
  console.log("session: ", session);

  // User session check
  if (!session?.user) {
    return (
      <div className="p-4 text-center text-red-500">
        Please log in to access your dashboard.
      </div>
    );
  }

  // Fetch all documents
  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user.name?.split(" ")[0]} 👋
      </h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Documents</h2>
        {/* <Button asChild> */}
        {/* <Link href="/dashboard/upload">+ Upload</Link> */}
        <FileUploader />
        {/* </Button> */}
      </div>

      {documents.length === 0 ? (
        <p className="text-gray-500">
          You haven&apos;t uploaded any documents yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="border rounded-lg p-4 hover:shadow transition"
            >
              <Link
                href={`/dashboard/${doc.id}`}
                className="text-lg font-medium"
              >
                {doc.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
