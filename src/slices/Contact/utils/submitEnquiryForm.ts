import { KeyTextField } from "@prismicio/client";

export interface EnquiryFormPayload {
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message: string;
  turnstileToken: string | null;
  recipients: KeyTextField;
}

/**
 * Posts the Enquiry Form to the same endpoint as the default contact form;
 * business, address and service are optional extras the API passes through.
 */
export const submitEnquiryForm = async (
  payload: EnquiryFormPayload,
): Promise<boolean> => {
  try {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
};
