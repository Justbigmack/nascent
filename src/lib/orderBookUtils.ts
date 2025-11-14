import {
  type OrderbookInterface,
  type OrderbookEntry,
  type LimitOrder,
} from "@/types/api/trading";
import { toast } from "sonner";
import {
  type Asset,
  ORDER_SIDE,
  ORDER_TYPE,
  type OrderSide,
} from "@/types/trading";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { OrderFormValues } from "@/schemas/orderForm";
import type { TFunction } from "i18next";
import { parseFloatSafe } from "@/lib/generalUtils";

export const calculateDepthPercentage = (total: number, maxTotal: number) => {
  return (total / maxTotal) * 100;
};

export interface NormalizedOrderbookEntry extends OrderbookEntry {
  total: number;
  depthPercent: number;
}

export interface NormalizedOrderbook {
  bids: NormalizedOrderbookEntry[];
  asks: NormalizedOrderbookEntry[];
}

interface CreateOrderbookHandlersProps {
  symbol: Asset;
  watch: UseFormWatch<OrderFormValues>;
  setValue: UseFormSetValue<OrderFormValues>;
  onSubmitOrder: (order: LimitOrder) => void;
  t: TFunction;
}

export const normalizeDataForOrderbook = (
  data: OrderbookInterface | undefined
): NormalizedOrderbook | null => {
  if (!data) return null;

  const sortedBids = [...data.bids].sort((a, b) => b.price - a.price);
  const sortedAsks = [...data.asks].sort((a, b) => a.price - b.price);

  const maxBidTotal = Math.max(
    ...sortedBids.map((bid) => bid.price * bid.quantity)
  );
  const maxAskTotal = Math.max(
    ...sortedAsks.map((ask) => ask.price * ask.quantity)
  );

  const bidsWithDepth = sortedBids.map((bid) => {
    const total = bid.price * bid.quantity;
    const depthPercent = (total / maxBidTotal) * 100;
    return { ...bid, total, depthPercent };
  });

  const asksWithDepth = sortedAsks.map((ask) => {
    const total = ask.price * ask.quantity;
    const depthPercent = (total / maxAskTotal) * 100;
    return { ...ask, total, depthPercent };
  });

  return {
    bids: bidsWithDepth,
    asks: asksWithDepth,
  };
};

export function createOrderbookHandlers({
  symbol,
  watch,
  setValue,
  onSubmitOrder,
  t,
}: CreateOrderbookHandlersProps) {
  const handlePriceClick = (price: string, side: OrderSide) => {
    const currentQuantity = watch("quantity");

    if (currentQuantity && parseFloatSafe(currentQuantity) > 0) {
      //If the form has quantity, fill it out and submit it instantly
      const priceNum = parseFloatSafe(price);
      const quantityNum = parseFloatSafe(currentQuantity);
      const notionalNum = priceNum * quantityNum;

      const order = {
        asset: symbol,
        side,
        type: ORDER_TYPE.LIMIT,
        quantity: quantityNum,
        price: priceNum,
        notional: notionalNum,
      };

      onSubmitOrder(order);
    } else {
      // If the form has no quantity, fill out the price and trigger a toast
      setValue("price", price);
      setValue("orderType", ORDER_TYPE.LIMIT);
      setValue("orderSide", side);

      toast.success(t("orderForm.formFilled"), {
        description: t("orderForm.formFilledDescription", {
          context: side,
          price,
        }),
      });
    }
  };

  return {
    handleAskClick: (price: string) => handlePriceClick(price, ORDER_SIDE.BUY),
    handleBidClick: (price: string) => handlePriceClick(price, ORDER_SIDE.SELL),
  };
}
