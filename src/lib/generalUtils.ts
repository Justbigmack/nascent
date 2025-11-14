export const parseFloatSafe = (value: string | undefined): number => {
  const num = parseFloat(value || "");
  return isNaN(num) ? 0 : num;
};
