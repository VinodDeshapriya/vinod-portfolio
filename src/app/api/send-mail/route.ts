import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { asImageSrc } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { determineRecipient } from "./determineRecipient";
import { getAdminEmailTemplate } from "./templates/getAdminEmailTemplate";
import { getUserEmailTemplate } from "./templates/getUserEmailTemplate";
import { parseSubmission } from "./parseSubmission";
import { MAX_FILES, MAX_TOTAL_SIZE_BYTES, MAX_TOTAL_SIZE_MB } from "./fileLimits";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    },
  );
  const data = await res.json();
  return data.success === true;
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      message,
      turnstileToken,
      recipients,
      business,
      address,
      service,
      files,
    } = await parseSubmission(request);

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Required fields missing." },
        { status: 400 },
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `You can upload a maximum of ${MAX_FILES} files.` },
        { status: 400 },
      );
    }

    if (files.reduce((sum, file) => sum + file.size, 0) > MAX_TOTAL_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Total file size exceeds the ${MAX_TOTAL_SIZE_MB}MB limit.` },
        { status: 400 },
      );
    }

    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the verification." },
        { status: 400 },
      );
    }

    const verified = await verifyTurnstile(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 400 },
      );
    }

    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const fromEmail =
      process.env.MAILGUN_FROM_EMAIL || `noreply@${mailgunDomain}`;

    if (!mailgunApiKey || !mailgunDomain) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 },
      );
    }

    const toRecipients = recipients
      ? recipients
          .split(",")
          .map((r: string) => r.trim())
          .filter(Boolean)
      : [];

    if (!toRecipients.length) {
      return NextResponse.json(
        { error: "No recipients configured." },
        { status: 500 },
      );
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: "api", key: mailgunApiKey });

    const fileNames = files.map((file) => file.name);
    const formValues = {
      name,
      email,
      phone,
      message,
      business,
      address,
      service,
      fileNames,
    };
    const extraText = [
      business && `Business: ${business}`,
      address && `Address: ${address}`,
      service && `Services: ${service}`,
    ]
      .filter(Boolean)
      .map((line) => `\n${line}`)
      .join("");
    const attachedText = fileNames.length
      ? `\n\nAttached files:\n${fileNames.join("\n")}`
      : "";

    // Only the team's email carries the files, not the sender's confirmation
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        data: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      })),
    );

    let headerLogoUrl: string | null = null;
    let footerLogoUrl: string | null = null;
    try {
      const settings = await createClient().getSingle("settings");
      headerLogoUrl = asImageSrc(settings.data.header_logo, { w: 160 });
      footerLogoUrl = asImageSrc(settings.data.footer_logo, { w: 120 });
    } catch (err) {
      console.error("send-mail: failed to fetch settings logos", err);
    }
    const logos = { headerLogoUrl, footerLogoUrl };

    const admin = determineRecipient({ recipient: toRecipients.join(",") });
    const adminRecipients = admin.recipient
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const userReply = determineRecipient({ recipient: email });

    await Promise.all([
      mg.messages.create(mailgunDomain, {
        from: fromEmail,
        to: adminRecipients,
        ...(admin.cc ? { cc: admin.cc } : {}),
        ...(admin.bcc ? { bcc: admin.bcc } : {}),
        ...(attachments.length ? { attachment: attachments } : {}),
        "h:Reply-To": email,
        subject: `New contact form submission from ${name}`,
        html: getAdminEmailTemplate(formValues, logos),
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}${extraText}\n\nMessage:\n${message || "(no message)"}${attachedText}`,
      }),
      mg.messages.create(mailgunDomain, {
        from: fromEmail,
        to: [userReply.recipient],
        subject: "We've received your message",
        html: getUserEmailTemplate(formValues, logos),
        text: `Hi ${name},\n\nThanks for getting in touch. We've received your message and someone from our team will get back to you shortly.`,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("send-mail error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
