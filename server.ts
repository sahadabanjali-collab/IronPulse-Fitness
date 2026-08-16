import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TGc3IW2596kQAH";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "YRz3BkeTa02O9xMU4qbh6Dfx";

  let razorpayInstance: Razorpay | null = null;
  function getRazorpay() {
    if (!razorpayInstance) {
      razorpayInstance = new Razorpay({
        key_id,
        key_secret,
      });
    }
    return razorpayInstance;
  }

  // 1. Create Order Endpoint
  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;

      if (!amount || typeof amount !== "number" || amount < 100) {
        return res.status(400).json({
          error: "Invalid amount. Minimum order amount is 100 paise (₹1).",
        });
      }

      const options = {
        amount: Math.round(amount), // amount in paise
        currency: currency.toUpperCase(),
        receipt: receipt || `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      };

      const instance = getRazorpay();
      const order = await instance.orders.create(options);

      return res.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: key_id,
      });
    } catch (err: any) {
      console.error("Error creating Razorpay order:", err);
      if (err.statusCode === 401) {
        return res.status(401).json({ error: "Razorpay authentication failed. Invalid API keys." });
      }
      return res.status(500).json({
        error: err?.error?.description || err?.message || "Failed to create Razorpay order.",
      });
    }
  });

  // 2. Verify Payment Endpoint
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: "Missing required signature verification fields.",
        });
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        return res.json({
          success: true,
          message: "Payment signature verified successfully.",
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "Payment verification failed: Signature mismatch.",
        });
      }
    } catch (err: any) {
      console.error("Error verifying payment signature:", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "Internal server error during signature verification.",
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
