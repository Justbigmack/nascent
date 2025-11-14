import express from "express";
import { v4 as uuidv4 } from "uuid";
import btcOrderbook from "./data/btc_orderbook.json" with { type: "json" };
import ethOrderbook from "./data/eth_orderbook.json" with { type: "json" };

const app = express();
const port = 3001;

app.use(express.json());

/* Endpoint for simple hello world test */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* Orderbook Endpoint
Specifying the optional asset parameter will allow getting the orderbook for that asset. The default is always BTC.
Example: http://localhost:3001/orderbook/ETH
*/
app.get(["/orderbook", "/orderbook/:asset"], (req, res) => {
  const asset = req.params.asset?.toUpperCase() || "BTC";
  switch (asset) {
    case "BTC":
      res.json(btcOrderbook);
      break;
    case "ETH":
      res.json(ethOrderbook);
      break;
    default:
      res.status(404).json({ error: "Asset not found" });
  }
});

/* Orderbook Endpoint
The trade requires: asset (string), side (BUY/SELL), type (optional: LIMIT/MARKET), quantity (number), price (number), notional (number)
This endpoint performs simple validation. Returns the submitted order, with a unique id and timestamp of submisison.
Example:
  curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"asset":"BTC","side":"BUY", "type": "LIMIT", "quantity": 2, "price": 61000, "notional": 122000}' \
    http://localhost:3001/trade
*/
app.post("/trade/", (req, res) => {
  const order = req.body;

  // Validations
  if (!order.asset) {
    res.status("422").send({ error: "Asset is missing" });
  }

  if (!order.side) {
    res.status("422").send({ error: "Side is missing" });
  }

  if (order.quantity <= 0) {
    res.status("422").send({ error: "Quantity is invalid" });
  }

  order.type = order.type || "LIMIT"; // default to LIMIT
  if (
    order.type?.toUpperCase() === "LIMIT" &&
    (!order.price || order.price <= 0)
  ) {
    res.status("422").send({ error: "Price is invalid for LIMIT order" });
  }
  if (order.type?.toUpperCase() === "MARKET" && order.price) {
    res
      .status("422")
      .send({ error: "Price shouldn't be provided for MARKET order" });
  }

  if (order.notional <= 0) {
    res.status("422").send({ error: "Notional is invalid" });
  }

  res.send({
    ...order,
    id: uuidv4(),
    timestamp: Date.now(),
  });
});

app.listen(port, () => {
  console.log(`Mock server listening on port ${port}`);
});
