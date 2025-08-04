"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function NotesEditor({ docId }: { docId: string }) {
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const trimmedNote = note.trim();
    if (!trimmedNote) return;

    try {
      const res = await fetch("/api/save-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedNote),
      });
      if (!res.ok) {
        alert("Failed to save note. Try again");
      } else {
        alert("Note Saved");
        setNote("");
      }
    } catch (err) {
      console.error("err: ", err);
      alert("Failed to save note. Try again");
    }
    setIsSaving(false);
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-2">Your Notes</h2>
      <Textarea
        rows={5}
        placeholder="Write your notes here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button className="mt-2" onClick={handleSave} disabled={isSaving}>
        Save Note
      </Button>
    </div>
  );
}
