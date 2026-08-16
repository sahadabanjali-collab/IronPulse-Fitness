import { createClient } from "@supabase/supabase-js";

// Use Supabase credentials provided by the user
const supabaseUrl = "https://iqvihkdbkzjfzazeozts.supabase.co";
const supabaseAnonKey = "sb_publishable_h9fyBf4t6yYbe_YZBDolmg_1MTza7lU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
