export const formatQuantity = (quantity: number, fractionDigits?: number) =>
  quantity.toFixed(fractionDigits ?? 4);

export const formatTotal = (total: number, fractionDigits?: number) =>
  total.toFixed(fractionDigits ?? 2);

export const formatPrice = (price: number) => {
  if (price < 1) return price.toFixed(4);
  if (price < 100) return price.toFixed(2);
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatMarketCap = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export const formatNotional = (notional: number, fractionDigits?: number) =>
  notional.toFixed(fractionDigits ?? 2);

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
