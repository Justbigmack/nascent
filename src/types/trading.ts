export const ASSET = {
  BTC: "BTC",
  ETH: "ETH",
} as const;

export type Asset = (typeof ASSET)[keyof typeof ASSET];

export const ORDER_SIDE = {
  BUY: "BUY",
  SELL: "SELL",
} as const;

export type OrderSide = (typeof ORDER_SIDE)[keyof typeof ORDER_SIDE];

export const ORDER_TYPE = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
} as const;

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

export type TFormInput = {
  orderSide: OrderSide;
  orderType: OrderType;
  price: string;
  quantity: string;
  notional: string;
};
