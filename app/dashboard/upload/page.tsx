// app/dashboard/upload/page.tsx
import FileUploader from "@/components/FileUploader";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Upload PDF</h1>
      <div className="border rounded-xl p-4 shadow-md bg-white dark:bg-zinc-900">
        <FileUploader />
      </div>
    </main>
  );
}
