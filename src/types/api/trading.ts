import { type Asset } from "@/types/trading";
import { type OrderSide, type OrderType } from "@/types/trading";

export interface RawOrderbookResponse {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface OrderbookEntry {
  price: number;
  quantity: number;
}

export interface OrderbookInterface {
  lastUpdateId: number;
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
}

export interface LimitOrder {
  asset: Asset;
  side: OrderSide;
  type: "LIMIT";
  quantity: number;
  price: number;
  notional: number;
}

export interface MarketOrder {
  asset: Asset;
  side: OrderSide;
  type: "MARKET";
  quantity: number;
}

export type TradeOrder = MarketOrder | LimitOrder;

export type SendTradeReturnType = {
  asset: Asset;
  id: string;
  notional?: number;
  price?: number;
  quantity?: number;
  side: OrderSide;
  timestamp: number;
  type: OrderType;
};
