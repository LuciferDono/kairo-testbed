const SLUG_RE = /^([a-z0-9]+-?)+$/;

export function isValidSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
