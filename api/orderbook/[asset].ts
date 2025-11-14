// File for Vercel to work after deployment
import type { VercelRequest, VercelResponse } from "@vercel/node";

import btcOrderbook from "../../server/data/btc_orderbook.json";
import ethOrderbook from "../../server/data/eth_orderbook.json";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { asset } = req.query;
  const assetUpper = (asset as string)?.toUpperCase() || "BTC";

  switch (assetUpper) {
    case "BTC":
      return res.json(btcOrderbook);
    case "ETH":
      return res.json(ethOrderbook);
    default:
      return res.status(404).json({ error: "Asset not found" });
  }
}
