import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Supabase cloud client for database synchronization
function getServerSupabaseClient() {
  const defaultUrl = "https://iqvihkdbkzjfzazeozts.supabase.co";
  const defaultKey = "sb_publishable_h9fyBf4t6yYbe_YZBDolmg_1MTza7lU";

  let url = defaultUrl;
  let key = defaultKey;

  const urlCandidate = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const keyCandidate =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (
    typeof urlCandidate === "string" &&
    (urlCandidate.trim().startsWith("http://") || urlCandidate.trim().startsWith("https://"))
  ) {
    url = urlCandidate.trim();
  }

  if (
    typeof keyCandidate === "string" &&
    keyCandidate.trim().length > 0 &&
    !keyCandidate.includes("YOUR_") &&
    !keyCandidate.includes("MY_")
  ) {
    key = keyCandidate.trim();
  }

  try {
    return createClient(url, key);
  } catch (err) {
    console.warn("Failed to initialize configured Supabase client, using fallback:", err);
    return createClient(defaultUrl, defaultKey);
  }
}

const supabase = getServerSupabaseClient();

// Path for persistent server inquiries storage
const INQUIRIES_FILE_PATH = path.join(process.cwd(), "inquiries_store.json");

interface ServerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "in_progress" | "converted" | "archived";
  notes?: string;
  createdAt: string;
  submittedAt: string;
}

function loadPersistedInquiries(): ServerInquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE_PATH)) {
      const data = fs.readFileSync(INQUIRIES_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load persisted inquiries:", err);
  }
  return [];
}

function savePersistedInquiries(inquiries: ServerInquiry[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE_PATH, JSON.stringify(inquiries, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist inquiries to disk:", err);
  }
}

async function syncWithSupabase(localList: ServerInquiry[]): Promise<ServerInquiry[]> {
  const mergedMap = new Map<string, ServerInquiry>();

  // Add local items
  for (const item of localList) {
    mergedMap.set(item.id, item);
  }

  try {
    const { data: supaRecords, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(supaRecords)) {
      for (const record of supaRecords) {
        const id = record.id ? `sup_${record.id}` : `inq_${Date.now()}`;
        const createdDate = record.created_at ? new Date(record.created_at) : new Date();

        const item: ServerInquiry = {
          id: id,
          name: record.name || "Anonymous",
          email: (record.email || "").toLowerCase().trim(),
          phone: record.phone || "",
          subject: record.program || "General Fitness Enquiry",
          message: record.message || "",
          source: "Contact Form (Cloud)",
          status: "new",
          notes: "",
          createdAt: createdDate.toISOString(),
          submittedAt: createdDate.toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
          }),
        };

        // Deduplication by id and content
        let exists = false;
        for (const existing of mergedMap.values()) {
          const exactMatch =
            existing.id === item.id ||
            existing.id === record.id ||
            (existing.email.toLowerCase().trim() === item.email &&
              existing.phone.replace(/\D/g, "") === item.phone.replace(/\D/g, "") &&
              (existing.message || "").substring(0, 30) === (item.message || "").substring(0, 30));

          if (exactMatch) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          mergedMap.set(item.id, item);
        }
      }
    }
  } catch (err) {
    console.warn("Supabase fetch sync notice in server:", err);
  }

  const result = Array.from(mergedMap.values()).sort((a, b) => {
    const tA = new Date(a.createdAt).getTime() || 0;
    const tB = new Date(b.createdAt).getTime() || 0;
    return tB - tA;
  });

  savePersistedInquiries(result);
  return result;
}

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

  // Initialize inquiries from persisted storage
  let serverInquiries: ServerInquiry[] = loadPersistedInquiries();

  // 3. Inquiries API Endpoints
  // GET all inquiries (newest first, synchronized with Supabase)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const local = loadPersistedInquiries();
      const synchronized = await syncWithSupabase(local);
      return res.json({
        success: true,
        inquiries: synchronized,
      });
    } catch (err: any) {
      console.warn("Failed to sync inquiries on GET:", err);
      return res.json({
        success: true,
        inquiries: loadPersistedInquiries(),
      });
    }
  });

  // POST new inquiry (saves to both local storage and Supabase cloud)
  app.post("/api/inquiries", async (req, res) => {
    try {
      const { name, email, phone, subject, message, source = "Contact Form" } = req.body;

      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: "Name, email, and phone are required fields.",
        });
      }

      const cleanName = String(name).trim();
      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPhone = String(phone).trim();
      const cleanSubject = subject ? String(subject).trim() : "General Fitness Enquiry";
      const cleanMessage = message ? String(message).trim() : "Interested in IronPulse Fitness programs.";
      const cleanSource = source ? String(source).trim() : "Contact Form";

      const now = new Date();
      let createdInquiryId = `inq_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // 1. Insert into Supabase cloud table
      try {
        const { data: supaResult, error: supaErr } = await supabase
          .from("contact_inquiries")
          .insert([
            {
              name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              program: cleanSubject,
              message: cleanMessage,
            },
          ])
          .select();

        if (!supaErr && supaResult && supaResult.length > 0 && supaResult[0].id) {
          createdInquiryId = `sup_${supaResult[0].id}`;
        }
      } catch (dbErr) {
        console.warn("Supabase server-side insert warning:", dbErr);
      }

      const newInquiry: ServerInquiry = {
        id: createdInquiryId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        source: cleanSource,
        status: "new",
        notes: "",
        createdAt: now.toISOString(),
        submittedAt: now.toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        }),
      };

      // 2. Load latest, unshift and persist to disk
      serverInquiries = loadPersistedInquiries();
      serverInquiries.unshift(newInquiry);
      savePersistedInquiries(serverInquiries);

      return res.status(201).json({
        success: true,
        inquiry: newInquiry,
      });
    } catch (err: any) {
      console.error("Error saving inquiry:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to record inquiry on server.",
      });
    }
  });

  // PATCH update inquiry status or notes
  app.patch("/api/inquiries/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      serverInquiries = loadPersistedInquiries();
      const inquiry = serverInquiries.find((inq) => inq.id === id);
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          error: "Inquiry not found.",
        });
      }

      if (status) {
        inquiry.status = status;
      }
      if (notes !== undefined) {
        inquiry.notes = notes;
      }

      savePersistedInquiries(serverInquiries);

      return res.json({
        success: true,
        inquiry,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || "Failed to update inquiry.",
      });
    }
  });

  // DELETE inquiry
  app.delete("/api/inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      serverInquiries = loadPersistedInquiries();
      const index = serverInquiries.findIndex((inq) => inq.id === id);

      if (index !== -1) {
        serverInquiries.splice(index, 1);
        savePersistedInquiries(serverInquiries);
      }

      // Also delete from Supabase if it is a Supabase ID
      if (id.startsWith("sup_")) {
        const rawUuid = id.replace("sup_", "");
        await supabase.from("contact_inquiries").delete().eq("id", rawUuid);
      } else {
        await supabase.from("contact_inquiries").delete().eq("id", id);
      }

      return res.json({
        success: true,
        message: "Inquiry deleted successfully.",
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || "Failed to delete inquiry.",
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
