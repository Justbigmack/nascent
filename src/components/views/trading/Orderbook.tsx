import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeDataForOrderbook } from "@/lib/orderBookUtils";
import {
  formatPrice,
  formatQuantity,
  formatTotal,
} from "@/lib/formattingUtils";

import { Badge } from "@/components/ui/badge";
import { ORDER_SIDE, type OrderSide } from "@/types/trading";
import { Route } from "@/routes/trading/$symbol";
import { getOrderbook } from "@/api/api";
import { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface OrderbookProps {
  onAskClick: (price: string) => void;
  onBidClick: (price: string) => void;
}

export const Orderbook = memo(({ onAskClick, onBidClick }: OrderbookProps) => {
  const { t } = useTranslation();
  const { symbol } = Route.useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orderbook", symbol],
    queryFn: () => getOrderbook(symbol),
  });

  const normalizedData = useMemo(() => normalizeDataForOrderbook(data), [data]);

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t("trading.orderBook")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-64">
          <p className="text-muted-foreground">{t("general.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !normalizedData) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t("trading.orderBook")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-64">
          <p className="text-destructive">{t("general.error")}</p>
        </CardContent>
      </Card>
    );
  }

  const bestAsks = normalizedData?.asks.slice(0, 10);
  const bestBids = normalizedData?.bids.slice(0, 10);
  const bestAskPrice = bestAsks[0].price;
  const bestBidPrice = bestBids[0].price;
  const spread = bestAskPrice - bestBidPrice;
  const spreadPercent = (spread / 50) * 100;

  const handleTableRowKeyDown = (
    e: React.KeyboardEvent,
    price: string,
    side: OrderSide
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (side === ORDER_SIDE.BUY) {
      onAskClick(price);
    } else {
      onBidClick(price);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t("trading.orderBook")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="grid grid-cols-2 gap-3 px-3 py-2.5 border-b bg-muted/30">
          <div>
            <p className="text-muted-foreground mb-0.5 text-xs">
              {t("trading.bestBid")}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-green-600 md:text-lg">
                ${formatPrice(bestBidPrice)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-0.5 text-xs">
              {t("trading.bestAsk")}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-red-600 md:text-lg">
                ${formatPrice(bestAskPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="mb-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge variant="destructive" className="text-xs">
                {t("trading.ask")}
              </Badge>
              <span className="text-muted-foreground hidden sm:inline text-xs">
                {t("general.sellers")}
              </span>
            </div>
            <Table className="border-separate border-spacing-y-0.5">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableHead className="text-left text-xs h-7 px-1.5">
                    {t("general.price")} (USD)
                  </TableHead>
                  <TableHead className="text-right text-xs h-7 px-1.5">
                    {t("general.quantity")}
                  </TableHead>
                  <TableHead className="text-right text-xs h-7 px-1.5">
                    {t("general.total")} (USD)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...bestAsks].reverse().map((ask, index) => {
                  const { depthPercent, price, quantity, total } = ask;
                  return (
                    <TableRow
                      key={`ask-${index}`}
                      className="relative cursor-pointer hover:bg-muted/70 border-b-0 h-6 my-0.5"
                      onClick={() => onAskClick(price.toString())}
                      onKeyDown={(e) =>
                        handleTableRowKeyDown(
                          e,
                          price.toString(),
                          ORDER_SIDE.BUY
                        )
                      }
                      role="button"
                      tabIndex={0}
                      aria-label={`${t("trading.clickToBuy")}: $${formatPrice(ask.price)}`}
                      style={{
                        backgroundImage: `linear-gradient(to left, rgba(239,68,68,0.1) ${depthPercent}%, transparent ${depthPercent}%)`,
                        borderRadius: "0.25rem",
                      }}
                    >
                      <TableCell className="text-left text-red-600 text-xs h-6 px-1.5 py-0.5">
                        ${formatPrice(price)}
                      </TableCell>
                      <TableCell className="text-right text-xs h-6 px-1.5 py-0.5">
                        {formatQuantity(quantity)}
                      </TableCell>
                      <TableCell className="text-right text-xs h-6 px-1.5 py-0.5">
                        ${formatTotal(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="my-2 py-1.5 px-1.5 bg-muted/50 rounded">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {t("general.spread")}:
              </span>
              <span>
                ${formatPrice(spread)} ({spreadPercent.toFixed(3)}%)
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Badge variant="default" className="bg-green-600 text-xs">
                {t("trading.bid")}
              </Badge>
              <span className="text-muted-foreground hidden sm:inline text-xs">
                {t("general.buyers")}
              </span>
            </div>
            <Table className="border-separate border-spacing-y-0.5">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableHead className="text-left text-xs h-7 px-1.5">
                    {t("general.price")} (USD)
                  </TableHead>
                  <TableHead className="text-right text-xs h-7 px-1.5">
                    {t("general.quantity")}
                  </TableHead>
                  <TableHead className="text-right text-xs h-7 px-1.5">
                    {t("general.total")} (USD)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestBids.map((bid, index) => {
                  const { depthPercent, price, quantity, total } = bid;
                  return (
                    <TableRow
                      key={`bid-${index}`}
                      className="relative cursor-pointer hover:bg-muted/70 border-b-0 h-6"
                      onClick={() => onBidClick(price.toString())}
                      onKeyDown={(e) =>
                        handleTableRowKeyDown(
                          e,
                          price.toString(),
                          ORDER_SIDE.SELL
                        )
                      }
                      tabIndex={0}
                      role="button"
                      aria-label={`${t("trading.clickToSell")}: $${formatPrice(bid.price)}`}
                      style={{
                        backgroundImage: `linear-gradient(to left, rgba(34,197,94,0.1) ${depthPercent}%, transparent ${depthPercent}%)`,
                        borderRadius: "0.25rem",
                      }}
                    >
                      <TableCell className="text-left text-green-600 text-xs h-6 px-1.5 py-0.5">
                        ${formatPrice(price)}
                      </TableCell>
                      <TableCell className="text-right text-xs h-6 px-1.5 py-0.5">
                        {formatQuantity(quantity)}
                      </TableCell>
                      <TableCell className="text-right text-xs h-6 px-1.5 py-0.5">
                        ${formatTotal(total)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
