import pdf from "pdf-parse";

export default async function extractTextFromPdf(buffer: Buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error("Failed to parse PDF:", err);
    return "";
  }
}
