// File for Vercel to work after deployment
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { v4 as uuidv4 } from "uuid";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const order = req.body;
    console.log("Received order:", req.body);

  // Validations
  if (!order.asset) {
    return res.status(422).send({ error: "Asset is missing" });
  }

  if (!order.side) {
    return res.status(422).send({ error: "Side is missing" });
  }

  if (order.quantity <= 0) {
    return res.status(422).send({ error: "Quantity is invalid" });
  }

  order.type = order.type || "LIMIT"; // default to LIMIT
  if (
    order.type?.toUpperCase() === "LIMIT" &&
    (!order.price || order.price <= 0)
  ) {
    return res.status(422).send({ error: "Price is invalid for LIMIT order" });
  }
  if (order.type?.toUpperCase() === "MARKET" && order.price) {
    return res
      .status(422)
      .send({ error: "Price shouldn't be provided for MARKET order" });
  }

  if (order.notional <= 0) {
    return res.status(422).send({ error: "Notional is invalid" });
  }

    return res.json({
      ...order,
      id: uuidv4(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error processing trade:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: (error as Error).message
    });
  }
}
