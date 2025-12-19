export function saveListingDraft(draft: any): void {
  if (typeof window === "undefined") return;
  const toSave = {
    ...draft,
    version: "v1",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("nxt_listing_draft_v1", JSON.stringify(toSave));
}

export function loadListingDraft(): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("nxt_listing_draft_v1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearListingDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nxt_listing_draft_v1");
}
