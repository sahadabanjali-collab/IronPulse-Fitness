import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Path for persistent server storage
const INQUIRIES_FILE_PATH = path.join(process.cwd(), "inquiries_store.json");
const MEMBERSHIPS_FILE_PATH = path.join(process.cwd(), "memberships_store.json");

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

interface ServerMembership {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan_name: string;
  price: string;
  billing_cycle: string;
  payment_id: string;
  is_trial: boolean;
  created_at: string;
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

function loadPersistedMemberships(): ServerMembership[] {
  try {
    if (fs.existsSync(MEMBERSHIPS_FILE_PATH)) {
      const data = fs.readFileSync(MEMBERSHIPS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load persisted memberships:", err);
  }
  return [];
}

function savePersistedMemberships(memberships: ServerMembership[]) {
  try {
    fs.writeFileSync(MEMBERSHIPS_FILE_PATH, JSON.stringify(memberships, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist memberships to disk:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Inquiries API Endpoints
  // GET all inquiries (newest first)
  app.get("/api/inquiries", (req, res) => {
    try {
      const inquiries = loadPersistedInquiries();
      return res.json({
        success: true,
        inquiries,
      });
    } catch (err: any) {
      console.warn("Failed to retrieve inquiries on GET:", err);
      return res.json({
        success: true,
        inquiries: [],
      });
    }
  });

  // POST new inquiry
  app.post("/api/inquiries", (req, res) => {
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
      const createdInquiryId = `inq_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

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

      const serverInquiries = loadPersistedInquiries();
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

      const serverInquiries = loadPersistedInquiries();
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
  app.delete("/api/inquiries/:id", (req, res) => {
    try {
      const { id } = req.params;
      const serverInquiries = loadPersistedInquiries();
      const index = serverInquiries.findIndex((inq) => inq.id === id);

      if (index !== -1) {
        serverInquiries.splice(index, 1);
        savePersistedInquiries(serverInquiries);
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

  // 2. Memberships API Endpoints
  // GET all memberships
  app.get("/api/memberships", (req, res) => {
    try {
      const memberships = loadPersistedMemberships();
      return res.json({
        success: true,
        memberships,
      });
    } catch (err: any) {
      return res.json({
        success: true,
        memberships: [],
      });
    }
  });

  // POST new membership registration
  app.post("/api/memberships", (req, res) => {
    try {
      const { name, email, phone, plan_name, price, billing_cycle, payment_id, is_trial } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: "Name and email are required.",
        });
      }

      const newMembership: ServerMembership = {
        id: req.body.id || `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone || "").trim(),
        plan_name: String(plan_name || "General Membership"),
        price: String(price || "₹0"),
        billing_cycle: String(billing_cycle || "Monthly"),
        payment_id: String(payment_id || `PASS_${Date.now()}`),
        is_trial: Boolean(is_trial),
        created_at: new Date().toISOString(),
      };

      const memberships = loadPersistedMemberships();
      memberships.unshift(newMembership);
      savePersistedMemberships(memberships);

      return res.status(201).json({
        success: true,
        membership: newMembership,
      });
    } catch (err: any) {
      console.error("Error saving membership:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to record membership.",
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
