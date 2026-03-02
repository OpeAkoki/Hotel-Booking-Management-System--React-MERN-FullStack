export function hasOverlap(
  checkIn1: Date,
  checkOut1: Date,
  checkIn2: Date,
  checkOut2: Date
): boolean {
  const a = new Date(checkIn1).getTime();
  const b = new Date(checkOut1).getTime();
  const c = new Date(checkIn2).getTime();
  const d = new Date(checkOut2).getTime();
  return a < d && c < b;
}
