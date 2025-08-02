"use client";

import { Button } from "@/components/ui/button"; // this is usually auto-imported from UT
import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export default function FileUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const { startUpload, isUploading } = useUploadThing("documentUploader");

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const res = await startUpload([selectedFile]);
      console.log("Upload success:", res);
      // TODO: Save file URL to DB here
    } catch (err) {
      console.error("Upload failed", err);
    }
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

      <Button onClick={handleClick} disabled={isUploading}>
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
