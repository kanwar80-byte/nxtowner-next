// Utility to clean AI or user-provided JSON strings for safe parsing
export function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();

  // Strip Markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```json|```/g, "").trim();
  }

  // If there's any text before the first "{", drop it
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace > 0) {
    cleaned = cleaned.slice(firstBrace);
  }

  return cleaned;
}
