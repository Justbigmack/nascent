import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ORDER_SIDE, ORDER_TYPE } from "@/types/trading";
import { ASSET, type Asset } from "@/types/trading";
import { useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrderFormSchema,
  type OrderFormValues,
} from "@/schemas/orderForm";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { NotFoundPage } from "@/components/layout/NotFoundPage";
import { ErrorPage } from "@/components/layout/ErrorPage";
import { OrderHistory } from "@/components/views/trading/OrderHistory";
import { Orderbook } from "@/components/views/trading/Orderbook";
import { OrderForm } from "@/components/views/trading/OrderForm";
import { sendTrade } from "@/api/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SendTradeReturnType } from "@/types/api/trading";
import { createOrderbookHandlers } from "@/lib/orderBookUtils";
import { parseFloatSafe } from "@/lib/generalUtils";

const symbolSchema = z.object({
  symbol: z.enum(Object.values(ASSET) as [Asset, ...Asset[]]),
});

export const Route = createFileRoute("/trading/$symbol")({
  params: {
    parse: (params) => {
      return { symbol: params.symbol?.toUpperCase() as Asset };
    },
    stringify: (params) => ({ symbol: params.symbol.toLowerCase() }),
  },
  beforeLoad: ({ params }) => {
    const result = symbolSchema.safeParse({ symbol: params.symbol });
    if (!result.success) {
      throw notFound();
    }
  },
  component: CryptoPage,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: () => <ErrorPage />,
});

function CryptoPage() {
  const { symbol } = Route.useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const orderFormSchema = createOrderFormSchema(t);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderSide: ORDER_SIDE.BUY,
      orderType: ORDER_TYPE.LIMIT,
      price: "",
      quantity: "",
      notional: "",
    },
    mode: "onSubmit",
  });

  const { handleSubmit, watch, setValue } = form;

  const tradeMutation = useMutation({
    mutationFn: sendTrade,

    onSuccess: (data: SendTradeReturnType) => {
      const storageKey = `trades_${symbol}`;
      const existingTrades = localStorage.getItem(storageKey);
      const trades = existingTrades ? JSON.parse(existingTrades) : [];

      trades.unshift(data);
      localStorage.setItem(storageKey, JSON.stringify(trades));

      queryClient.invalidateQueries({ queryKey: ["orderbook", symbol] });
      queryClient.invalidateQueries({ queryKey: ["trades", symbol] });

      toast.success(t("orderForm.orderSuccess"), {
        description: t("orderForm.orderSuccessDescription", {
          context: data.type,
          side: data.side,
          quantity: data.quantity,
          symbol,
          price: data.price,
        }),
      });

      form.reset();
    },
    onError: (error: Error) => {
      toast.error(t("orderForm.orderFailed"), {
        description: error.message,
      });
    },
  });

  // This is used in the callback functions to not ignore react's warning message
  // The other way to fix that would be to ignore it
  const tradeMutateRef = useRef(tradeMutation.mutate);
  tradeMutateRef.current = tradeMutation.mutate;

  const onSubmit = async (data: OrderFormValues) => {
    if (data.orderType === ORDER_TYPE.LIMIT) {
      const order = {
        asset: symbol,
        side: data.orderSide,
        type: ORDER_TYPE.LIMIT,
        quantity: parseFloatSafe(data.quantity),
        price: parseFloatSafe(data.price),
        notional: parseFloatSafe(data.notional),
      };
      tradeMutation.mutate(order);
      return;
    }

    const order = {
      asset: symbol,
      side: data.orderSide,
      type: ORDER_TYPE.MARKET,
      quantity: parseFloatSafe(data.quantity),
    };

    tradeMutation.mutate(order);
  };

  const { handleAskClick, handleBidClick } = useMemo(
    () =>
      createOrderbookHandlers({
        symbol,
        watch,
        setValue,
        onSubmitOrder: tradeMutateRef.current,
        t,
      }),
    [symbol, watch, setValue, t]
  );

  return (
    <div className="py-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Trading {symbol}</h1>
      <Button variant="ghost" className="w-fit" asChild>
        <Link to="/">
          <Home className="h-4 w-4" />
          {t("general.backToHomepage")}
        </Link>
      </Button>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Orderbook onAskClick={handleAskClick} onBidClick={handleBidClick} />
        <Card>
          <CardHeader>
            <CardTitle>{t("orderForm.placeOrder")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderForm
              form={form}
              isPending={tradeMutation.isPending}
              onSubmit={handleSubmit(onSubmit)}
            />
          </CardContent>
        </Card>
        <OrderHistory />
      </div>
    </div>
  );
}
