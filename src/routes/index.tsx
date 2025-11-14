import { useDeferredValue, useState } from "react";

import { CryptoCard } from "@/components/views/homepage/CryptoCard";
import { ErrorPage } from "@/components/layout/ErrorPage";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: Homepage,
  errorComponent: () => <ErrorPage />,
});

// in real world scenario, we would fetch data using tanstack query
const cryptos = [
  {
    symbol: "BTC" as const,
    name: "Bitcoin",
    change24h: 5,
    currentPrice: 100,
    marketCap: 50000,
    volume24h: 34968347865,
  },
  {
    symbol: "ETH" as const,
    name: "Ethereum",
    change24h: -5,
    currentPrice: 300,
    marketCap: 50000,
    volume24h: 345876237845,
  },
];

function Homepage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(deferredSearchQuery.toLowerCase())
  );

  return (
    <div className="py-6">
      <div className="mb-4">
        <h1 className="mb-2">{t("cryptoSelector.title")}</h1>
        <p className="text-muted-foreground">{t("cryptoSelector.subtitle")}</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("cryptoSelector.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCryptos.map((crypto) => (
          <CryptoCard crypto={crypto} key={crypto.symbol} />
        ))}
      </div>

      {filteredCryptos.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("cryptoSelector.noResults")}
        </div>
      )}
    </div>
  );
}
