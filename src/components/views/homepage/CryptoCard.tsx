import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatMarketCap, formatPrice } from "@/lib/formattingUtils";

import type { Asset } from "@/types/trading";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface CryptoProps {
  crypto: {
    symbol: Asset;
    name: string;
    change24h: number;
    currentPrice: number;
    marketCap: number;
    volume24h: number;
  };
}

export const CryptoCard = memo(({ crypto }: CryptoProps) => {
  const { t } = useTranslation();

  return (
    <Link
      key={crypto.symbol}
      to="/trading/$symbol"
      params={{ symbol: crypto.symbol }}
      className="no-underline"
    >
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{crypto.symbol}</span>
              </div>
              <p className="text-muted-foreground">{crypto.name}</p>
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                crypto.change24h >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {crypto.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(crypto.change24h).toFixed(2)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-muted-foreground">{t("general.price")}</p>
              <p className="text-2xl">${formatPrice(crypto.currentPrice)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-muted-foreground">
                  {t("cryptoSelector.marketCap")}
                </p>
                <p>{formatMarketCap(crypto.marketCap)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("cryptoSelector.volume24h")}
                </p>
                <p>{formatMarketCap(crypto.volume24h)}</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4" variant="outline">
            {t("cryptoSelector.trade")} {crypto.symbol}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
});
