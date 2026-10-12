export interface MembershipRecord {
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

const LOCAL_MEMBERSHIPS_KEY = "ironpulse_local_memberships";

function getStoredLocalMemberships(): MembershipRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_MEMBERSHIPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalMemberships(memberships: MembershipRecord[]) {
  try {
    localStorage.setItem(LOCAL_MEMBERSHIPS_KEY, JSON.stringify(memberships));
  } catch (err) {
    console.error("Failed to save memberships to localStorage:", err);
  }
}

export async function getMemberships(): Promise<MembershipRecord[]> {
  const mergedMap = new Map<string, MembershipRecord>();

  // 1. Fetch from server API
  try {
    const res = await fetch("/api/memberships");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.memberships)) {
        for (const m of data.memberships) {
          mergedMap.set(m.id, m);
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch memberships from /api/memberships:", err);
  }

  // 2. Merge with local storage
  const localList = getStoredLocalMemberships();
  for (const m of localList) {
    if (!mergedMap.has(m.id)) {
      mergedMap.set(m.id, m);
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) => {
    const tA = new Date(a.created_at).getTime() || 0;
    const tB = new Date(b.created_at).getTime() || 0;
    return tB - tA;
  });
}

export async function saveMembership(data: {
  name: string;
  email: string;
  phone: string;
  plan_name: string;
  price: string;
  billing_cycle: string;
  payment_id: string;
  is_trial: boolean;
}): Promise<MembershipRecord> {
  const newRecord: MembershipRecord = {
    id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    plan_name: data.plan_name,
    price: data.price,
    billing_cycle: data.billing_cycle,
    payment_id: data.payment_id,
    is_trial: data.is_trial,
    created_at: new Date().toISOString(),
  };

  // 1. Post to server API
  try {
    const res = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.membership) {
        newRecord.id = json.membership.id;
      }
    }
  } catch (err) {
    console.warn("Server POST /api/memberships notice:", err);
  }

  // 2. Persist to local storage
  const current = getStoredLocalMemberships();
  const updated = [newRecord, ...current.filter((m) => m.id !== newRecord.id)];
  saveLocalMemberships(updated);

  return newRecord;
}
