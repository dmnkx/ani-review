export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getRatingColor(rating: number): string {
  if (rating >= 9) return "text-emerald-400";
  if (rating >= 7) return "text-sky-400";
  if (rating >= 5) return "text-amber-400";
  return "text-rose-400";
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9) return "명작";
  if (rating >= 7) return "추천";
  if (rating >= 5) return "보통";
  return "비추천";
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
