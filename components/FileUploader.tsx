"use client";

import { Button } from "@/components/ui/button"; // this is usually auto-imported from UT
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export default function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { startUpload, isUploading } = useUploadThing("documentUploader");
  const router = useRouter();

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const res = await startUpload([selectedFile]);
      console.log("Upload success:", res);

      const uploaded = res?.[0];
      console.log("\nuploaded: ", uploaded);
      if (!uploaded) return;

      const uploadRes = await fetch("/api/save-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploaded.name,
          fileUrl: uploaded.url,
        }),
      });

      if (!uploadRes.ok) {
        alert("Unable to upload. Try again");
        setFile(null);
      } else {
        const uploadedDoc = await uploadRes.json();
        const { id: docId } = uploadedDoc;

        const summaryRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            docId,
          }),
        });

        if (!summaryRes.ok) {
          alert("Unable to summarize. Try again");
          setFile(null);
        } else {
          router.push(`/dashboard/${docId}`);
          return;
        }
      }
    } catch (err) {
      console.error("Error", err);
      alert("Failed to process pdf. Try again");
    }

    setIsProcessing(false);
  };

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={inputRef}
        onChange={handleChange}
      />

      <Button onClick={handleClick} disabled={isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isUploading ? "Uploading..." : "Summarizing..."}
          </>
        ) : (
          "Choose file"
        )}
      </Button>
      <div className="mt-4">
        {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
      </div>
    </>
  );
}
