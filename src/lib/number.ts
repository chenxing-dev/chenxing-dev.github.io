export const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max);
};

export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value);
};
