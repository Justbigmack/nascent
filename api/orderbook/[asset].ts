// File for Vercel to work after deployment
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { asset } = req.query;
  const assetUpper = (asset as string)?.toUpperCase() || "BTC";

  try {
    let orderbookData;

    switch (assetUpper) {
      case "BTC": {
        const btcPath = join(process.cwd(), "api", "data", "btc_orderbook.json");
        orderbookData = JSON.parse(readFileSync(btcPath, "utf-8"));
        break;
      }
      case "ETH": {
        const ethPath = join(process.cwd(), "api", "data", "eth_orderbook.json");
        orderbookData = JSON.parse(readFileSync(ethPath, "utf-8"));
        break;
      }
      default:
        return res.status(404).json({ error: "Asset not found" });
    }

    return res.json(orderbookData);
  } catch (error) {
    console.error("Error reading orderbook data:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: (error as Error).message
    });
  }
}
