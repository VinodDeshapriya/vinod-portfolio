import type { NextRequest } from "next/server";

export interface Submission {
  name: string;
  email: string;
  phone: string;
  message?: string;
  turnstileToken?: string;
  recipients?: string;
  // Optional, sent by the Contact "Enquiry Form" and Hero "Two Columns with Form" variations
  business?: string;
  address?: string;
  service?: string;
  /** Attachments; only the Hero "Two Columns with Form" variation sends any */
  files: File[];
}

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/**
 * Reads the request body of /api/send-mail. The default Contact form and the
 * Enquiry Form post JSON; the Hero form posts multipart so it can attach files.
 * Both end up as the same shape, so everything after this is shared.
 */
export async function parseSubmission(
  request: NextRequest,
): Promise<Submission> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const text = (key: string) => String(form.get(key) ?? "");

    return {
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      message: text("message"),
      turnstileToken: text("turnstileToken"),
      recipients: text("recipients"),
      business: optionalText(form.get("business")),
      address: optionalText(form.get("address")),
      service: optionalText(form.get("service")),
      files: form
        .getAll("files")
        .filter((value): value is File => value instanceof File),
    };
  }

  const body = await request.json();
  const { name, email, phone, message, turnstileToken, recipients } = body;

  return {
    name,
    email,
    phone,
    message,
    turnstileToken,
    recipients,
    business: optionalText(body.business),
    address: optionalText(body.address),
    service: optionalText(body.service),
    files: [],
  };
}
