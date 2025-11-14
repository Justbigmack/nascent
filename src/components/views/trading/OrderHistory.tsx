import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatNotional,
  formatPrice,
  formatQuantity,
  formatTime,
} from "@/lib/formattingUtils";

import { Badge } from "@/components/ui/badge";
import { ORDER_SIDE } from "@/types/trading";
import { Route } from "@/routes/trading/$symbol";
import type { SendTradeReturnType } from "@/types/api/trading";
import { clsx } from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// would have been an API call
const fetchTradeHistory = async (
  asset: string
): Promise<SendTradeReturnType[]> => {
  const storageKey = `trades_${asset}`;
  const existingTrades = localStorage.getItem(storageKey);
  return existingTrades ? JSON.parse(existingTrades) : [];
};

export const OrderHistory = () => {
  const { t } = useTranslation();
  const { symbol } = Route.useParams();

  const { data: trades = [] } = useQuery({
    queryKey: ["trades", symbol],
    queryFn: () => fetchTradeHistory(symbol),
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t("orderHistory.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto min-h-0 px-0">
        <div className="px-6">
          {trades.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>{t("orderHistory.noOrders")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={clsx("text-white", {
                          "bg-green-600": trade.side === ORDER_SIDE.BUY,
                          "bg-red-600": trade.side === ORDER_SIDE.SELL,
                        })}
                      >
                        {trade.side}
                      </Badge>
                      <span className="font-medium">{trade.asset}</span>
                      <Badge variant="outline">{trade.type}</Badge>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {t("orderHistory.filled")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500 text-sm">
                        {t("general.price")}
                      </p>
                      <p
                        className={clsx("font-medium", {
                          "text-green-600": trade.side === ORDER_SIDE.BUY,
                          "text-red-600": trade.side === ORDER_SIDE.SELL,
                        })}
                      >
                        {trade.price !== undefined
                          ? formatPrice(trade.price)
                          : t("general.notAvailable")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        {t("general.quantity")}
                      </p>
                      <p className="font-medium">
                        {trade.quantity !== undefined
                          ? `${formatQuantity(trade.quantity)} ${trade.asset}`
                          : t("general.notAvailable")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        {t("general.total")}
                      </p>
                      <p className="font-medium">
                        {trade.notional !== undefined
                          ? formatNotional(trade.notional)
                          : t("general.notAvailable")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">
                        {t("general.time")}
                      </p>
                      <p className="font-medium">
                        {trade.timestamp !== undefined
                          ? formatTime(trade.timestamp)
                          : t("general.notAvailable")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
