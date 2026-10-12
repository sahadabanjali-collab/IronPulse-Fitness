/**
 * n8n Webhook Configuration for IronPulse Fitness
 *
 * REPLACE THE PLACEHOLDER BELOW WITH YOUR ACTUAL N8N WEBHOOK URL:
 * e.g., "https://your-n8n-instance.com/webhook/ironpulse-contact"
 * Or define VITE_N8N_WEBHOOK_URL in your .env file.
 */
export const N8N_WEBHOOK_URL: string =
  (import.meta as any).env?.VITE_N8N_WEBHOOK_URL ||
  "https://your-n8n-domain.com/webhook/ironpulse-contact";

export interface N8nContactPayload {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  submittedAt: string;
}

/**
 * Sends contact enquiry data to the configured n8n webhook.
 */
export async function sendContactToN8n(payload: N8nContactPayload): Promise<{ success: boolean; data?: any }> {
  // Skip if still using default placeholder domain
  if (
    !N8N_WEBHOOK_URL ||
    N8N_WEBHOOK_URL.includes("your-n8n-domain") ||
    N8N_WEBHOOK_URL.includes("your-n8n-instance")
  ) {
    return { success: true, data: { status: "skipped_placeholder_webhook" } };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
      },
      body: JSON.stringify(payload),
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`n8n webhook response not ok (${response.status}):`, errorText);
      return { success: false };
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = { status: "ok" };
    }

    return { success: true, data };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn("n8n webhook dispatch noticed:", err.message);
    return { success: false };
  }
}
