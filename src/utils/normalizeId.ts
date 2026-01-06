export type IdLike =
  | string
  | number
  | null
  | undefined
  | { id?: unknown }
  | { value?: unknown }
  | Record<string, unknown>;

export function normalizeId(input: IdLike): string | null {
  if (input == null) return null;

  if (typeof input === "string") {
    const s = input.trim();
    return s.length ? s : null;
  }

  if (typeof input === "number") return String(input);

  // Handle common "object with id" shapes
  if (typeof input === "object") {
    const maybeId = (input as any).id ?? (input as any).value;
    if (typeof maybeId === "string") {
      const s = maybeId.trim();
      return s.length ? s : null;
    }
    if (typeof maybeId === "number") return String(maybeId);
  }

  // Anything else is invalid for an ID
  return null;
}

export function assertId(input: unknown, label: string): string {
  const id = normalizeId(input as any);
  if (!id) {
    // Fail fast in dev builds
    throw new Error(`Invalid ${label}: expected string id, received ${JSON.stringify(input)}`);
  }
  return id;
}


