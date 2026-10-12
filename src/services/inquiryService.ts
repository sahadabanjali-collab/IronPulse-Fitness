import { Inquiry, InquiryStatus } from "../types/inquiry";

const LOCAL_STORAGE_KEY = "ironpulse_local_inquiries";

// Purge any legacy seed inquiry IDs from older builds
const LEGACY_SEED_IDS = new Set(["inq_1724180001", "inq_1724180002", "inq_1724180003"]);

function getStoredLocalInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: Inquiry[] = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filter out older demo seed inquiries
      const clean = parsed.filter((i) => !LEGACY_SEED_IDS.has(i.id));
      if (clean.length !== parsed.length) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clean));
      }
      return clean;
    }
    return [];
  } catch {
    return [];
  }
}

function saveLocalInquiries(inquiries: Inquiry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inquiries));
  } catch (e) {
    console.error("Failed to save inquiries to localStorage:", e);
  }
}

// 1. Fetch all inquiries (Server + Local Fallback)
export async function getInquiries(): Promise<Inquiry[]> {
  const mergedMap = new Map<string, Inquiry>();

  // Helper to generate a deduplication key
  const getDedupKey = (item: { name: string; email: string; phone: string; message?: string }) => {
    return `${item.email.trim().toLowerCase()}_${item.phone.replace(/\D/g, "")}_${(item.message || "").substring(0, 30)}`;
  };

  // 1. Fetch from Server API
  try {
    const res = await fetch("/api/inquiries");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        for (const inq of data.inquiries) {
          if (!LEGACY_SEED_IDS.has(inq.id)) {
            mergedMap.set(inq.id, inq);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch inquiries from /api/inquiries:", err);
  }

  // 2. Merge with local storage entries
  const localList = getStoredLocalInquiries();
  for (const localInq of localList) {
    if (!LEGACY_SEED_IDS.has(localInq.id)) {
      let alreadyExists = false;
      const localDedup = getDedupKey(localInq);
      for (const existing of mergedMap.values()) {
        if (existing.id === localInq.id || getDedupKey(existing) === localDedup) {
          alreadyExists = true;
          break;
        }
      }
      if (!alreadyExists) {
        mergedMap.set(localInq.id, localInq);
      }
    }
  }

  // Convert to array and sort newest first
  const result = Array.from(mergedMap.values()).sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  saveLocalInquiries(result);
  return result;
}

// 2. Create new inquiry
export async function createInquiry(payload: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  source?: string;
}): Promise<Inquiry> {
  const now = new Date();
  const cleanName = payload.name.trim();
  const cleanEmail = payload.email.trim().toLowerCase();
  const cleanPhone = payload.phone.trim();
  const cleanSubject = payload.subject?.trim() || "General Fitness Enquiry";
  const cleanMessage = payload.message?.trim() || "Interested in IronPulse Fitness programs.";
  const cleanSource = payload.source || "Contact Form";

  const fallbackInquiry: Inquiry = {
    id: `inq_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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

  let savedInquiry = fallbackInquiry;

  // 1. Post to Server Backend
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        source: cleanSource,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.inquiry) {
        savedInquiry = data.inquiry;
      }
    }
  } catch (err) {
    console.warn("Server POST /api/inquiries notice:", err);
  }

  // 2. Update local storage
  const current = getStoredLocalInquiries();
  const updated = [savedInquiry, ...current.filter((i) => i.id !== savedInquiry.id)];
  saveLocalInquiries(updated);

  // 3. Dispatch custom window event so Admin dashboard immediately updates in real-time
  try {
    window.dispatchEvent(
      new CustomEvent("ironpulse:new_inquiry", {
        detail: savedInquiry,
      })
    );
  } catch {
    // Ignore in non-browser env
  }

  return savedInquiry;
}

// 3. Update inquiry status or notes
export async function updateInquiryStatus(
  id: string,
  status?: InquiryStatus,
  notes?: string
): Promise<boolean> {
  try {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
  } catch (e) {
    console.warn("Server update failed, updating local store:", e);
  }

  // Update local store
  const list = getStoredLocalInquiries();
  const target = list.find((i) => i.id === id);
  if (target) {
    if (status) target.status = status;
    if (notes !== undefined) target.notes = notes;
    saveLocalInquiries([...list]);
    return true;
  }
  return false;
}

// 4. Delete inquiry
export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
  } catch (e) {
    console.warn("Server delete failed, deleting locally:", e);
  }

  const list = getStoredLocalInquiries();
  const filtered = list.filter((i) => i.id !== id);
  saveLocalInquiries(filtered);
  return true;
}

// 5. Export inquiries to CSV
export function exportInquiriesToCSV(inquiries: Inquiry[]): void {
  const headers = ["ID", "Date Submitted", "Full Name", "Phone", "Email", "Subject/Program", "Source", "Status", "Notes", "Message"];
  
  const rows = inquiries.map((i) => [
    `"${i.id}"`,
    `"${i.submittedAt}"`,
    `"${i.name.replace(/"/g, '""')}"`,
    `"${i.phone}"`,
    `"${i.email}"`,
    `"${i.subject.replace(/"/g, '""')}"`,
    `"${i.source}"`,
    `"${i.status}"`,
    `"${(i.notes || "").replace(/"/g, '""')}"`,
    `"${i.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ironpulse_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
