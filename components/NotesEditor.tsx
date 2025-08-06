"use client";

import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type Note = {
  content: string;
  id: string;
  createdAt: number;
};

export default function NotesEditor({ docId }: { docId: string }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isFetchingNotes, setIsFetchingNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsFetchingNotes(true);
      try {
        const notesRes = await fetch(`/api/notes?docId=${docId}`);

        if (!notesRes.ok) {
          alert("Failed to load notes");
        } else {
          const { notes = [] } = await notesRes.json();

          setNotes(notes);
        }
      } catch (err) {
        console.error("err: ", err);
        alert("Failed to load notes");
      }
      setIsFetchingNotes(false);
    };
    fetchNotes();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const trimmedNote = note.trim();
    if (!trimmedNote) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: trimmedNote, docId }),
      });
      if (!res.ok) {
        alert("Failed to save note. Try again");
      } else {
        alert("Note Saved");
        const { note } = await res.json();
        setNotes((prev) => [...prev, note]);
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
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {isFetchingNotes ? (
          <div>Loading notes...</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={`text-sm p-2 rounded bg-muted`}>
              <pre className="text-wrap">{note.content}</pre>
              <div className="text-xs text-gray-400 flex justify-end">
                {new Date(note.createdAt).toDateString()}
              </div>
            </div>
          ))
        )}
      </div>
      <Textarea
        rows={5}
        placeholder="Write your notes here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button className="mt-2" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Note"}
      </Button>
    </div>
  );
}
