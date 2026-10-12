import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables with project fallbacks
function getValidSupabaseUrl(): string {
  const defaultUrl = "https://iqvihkdbkzjfzazeozts.supabase.co";
  try {
    const env = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
    const candidate = env.VITE_SUPABASE_URL || env.SUPABASE_URL;

    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
      }
    }
  } catch (e) {
    console.warn("Error reading Supabase URL from env:", e);
  }
  return defaultUrl;
}

function getValidSupabaseKey(): string {
  const defaultKey = "sb_publishable_h9fyBf4t6yYbe_YZBDolmg_1MTza7lU";
  try {
    const env = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
    const candidate =
      env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      env.VITE_SUPABASE_ANON_KEY ||
      env.SUPABASE_ANON_KEY;

    if (
      typeof candidate === "string" &&
      candidate.trim().length > 0 &&
      !candidate.includes("YOUR_") &&
      !candidate.includes("MY_")
    ) {
      return candidate.trim();
    }
  } catch (e) {
    console.warn("Error reading Supabase key from env:", e);
  }
  return defaultKey;
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseKey();

function initSupabase() {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error("Failed to initialize custom Supabase client, falling back to default:", err);
    return createClient(
      "https://iqvihkdbkzjfzazeozts.supabase.co",
      "sb_publishable_h9fyBf4t6yYbe_YZBDolmg_1MTza7lU",
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );
  }
}

export const supabase = initSupabase();

export interface AdminRecord {
  id: string;
  user_id: string;
  email: string;
  created_at?: string;
}

export interface MembershipData {
  name: string;
  email: string;
  phone: string;
  plan_name: string;
  price: string;
  billing_cycle: string;
  payment_id: string;
  is_trial: boolean;
}

export interface ContactInquiryData {
  name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
}

export async function saveMembership(data: MembershipData) {
  const { data: insertedData, error } = await supabase
    .from("memberships")
    .insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        plan_name: data.plan_name,
        price: data.price,
        billing_cycle: data.billing_cycle,
        payment_id: data.payment_id,
        is_trial: data.is_trial,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase error saving membership details:", error);
    throw error;
  }
  return insertedData;
}

export async function saveContactInquiry(data: ContactInquiryData) {
  const { data: insertedData, error } = await supabase
    .from("contact_inquiries")
    .insert([
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        program: data.program,
        message: data.message,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase error saving contact inquiry:", error);
    throw error;
  }
  return insertedData;
}

export async function fetchContactInquiries(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch contact_inquiries warning:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetch exception:", err);
    return [];
  }
}

export async function fetchMemberships(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch memberships warning:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("Supabase fetch memberships exception:", err);
    return [];
  }
}

