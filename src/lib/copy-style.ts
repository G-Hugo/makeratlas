/** User-facing copy: avoid em dash (—), use colon instead. */
export function noEmDash(text: string): string {
  return text.replace(/\s—\s/g, " : ");
}
