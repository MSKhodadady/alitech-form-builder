export function secondsToPerDateStr(seconds: number) {
  return new Date(seconds * 1000).toLocaleDateString("fa-ir", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}
