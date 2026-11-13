import { KeyTextField } from "@prismicio/client";

interface SubmitContactFormParams {
  name: string;
  email: string;
  phone: string;
  message: string;
  turnstileToken: string;
  recipients: KeyTextField;
}

export const submitContactForm = async ({
  name,
  email,
  phone,
  message,
  turnstileToken,
  recipients,
}: SubmitContactFormParams): Promise<boolean> => {
  try {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        message,
        turnstileToken,
        recipients,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
};
