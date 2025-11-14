import {
  type RawOrderbookResponse,
  type OrderbookInterface,
  type TradeOrder,
  type SendTradeReturnType,
} from "@/types/api/trading";

import { type Asset } from "@/types/trading";

export const getOrderbook = async (
  asset: Asset
): Promise<OrderbookInterface> => {
  const response = await fetch(`/orderbook/${asset}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch orderbook for ${asset}`);
  }
  const raw: RawOrderbookResponse = await response.json();

  return {
    lastUpdateId: raw.lastUpdateId,
    bids: raw.bids.map(([price, quantity]) => ({
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    })),
    asks: raw.asks.map(([price, quantity]) => ({
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    })),
  };
};

export const sendTrade = async (
  order: TradeOrder
): Promise<SendTradeReturnType> => {
  const response = await fetch("/trade", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit trade");
  }

  return response.json();
};
