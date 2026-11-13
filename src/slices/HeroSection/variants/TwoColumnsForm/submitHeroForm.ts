import { KeyTextField } from "@prismicio/client";

export interface HeroFormPayload {
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  files: File[];
  turnstileToken: string | null;
  recipients: KeyTextField;
}

/**
 * Posts the Hero "Two Columns with Form" submission to the same endpoint as
 * the Contact forms (/api/send-mail, so they share one backend path). It goes
 * as multipart so the files can ride along; the route accepts that as well as
 * the JSON the Contact forms send.
 */
export const submitHeroForm = async ({
  files,
  turnstileToken,
  recipients,
  ...fields
}: HeroFormPayload): Promise<boolean> => {
  try {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) =>
      formData.append(key, value),
    );
    formData.append("turnstileToken", turnstileToken ?? "");
    formData.append("recipients", recipients ?? "");
    files.forEach((file) => formData.append("files", file, file.name));

    const res = await fetch("/api/send-mail", {
      method: "POST",
      body: formData,
    });
    return res.ok;
  } catch {
    return false;
  }
};
