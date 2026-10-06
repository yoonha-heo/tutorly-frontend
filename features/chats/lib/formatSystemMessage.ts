const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function formatLocalDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatSystemMessage(content: string) {
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!ISO_INSTANT.test(trimmed)) return line;
      return formatLocalDateTime(trimmed);
    })
    .join("\n");
}
