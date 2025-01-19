export function enNumberToPer(n: any) {
  const nn = Number(n);

  if (Number.isNaN(nn)) return "";

  return nn.toLocaleString("fa-ir");
}
