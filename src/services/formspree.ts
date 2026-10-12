export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdeadbro";

export interface FormspreePayload {
  name: string;
  email: string;
  phone: string;
  program?: string;
  subject?: string;
  message: string;
  submittedAt?: string;
}

export async function sendContactToFormspree(
  payload: FormspreePayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        program: payload.program || payload.subject || "General Enquiry",
        subject: `New Enquiry from ${payload.name} - ${payload.program || payload.subject || "General Enquiry"}`,
        message: payload.message,
        _replyto: payload.email,
        submittedAt: payload.submittedAt || new Date().toISOString(),
      }),
    });

    if (response.ok) {
      return { success: true };
    }

    const data = await response.json().catch(() => null);
    let errorMessage = "Unable to submit enquiry to Formspree.";

    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.map((err: any) => err.message).join(", ");
    } else if (data && typeof data.error === "string") {
      errorMessage = data.error;
    }

    return { success: false, error: errorMessage };
  } catch (err: any) {
    console.error("Formspree submission error:", err);
    return {
      success: false,
      error: err?.message || "Network error while connecting to Formspree.",
    };
  }
}
