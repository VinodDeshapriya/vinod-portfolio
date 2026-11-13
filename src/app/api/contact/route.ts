import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";

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
    const body = await request.json();
    const { name, email, phone, message, turnstileToken, recipients } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Required fields missing." },
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
    const fromEmail = process.env.MAILGUN_FROM_EMAIL || `noreply@${mailgunDomain}`;

    if (!mailgunApiKey || !mailgunDomain) {
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 },
      );
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: "api", key: mailgunApiKey });

    const toRecipients = recipients
      ? recipients.split(",").map((r: string) => r.trim()).filter(Boolean)
      : [];

    if (!toRecipients.length) {
      return NextResponse.json(
        { error: "No recipients configured." },
        { status: 500 },
      );
    }

    await mg.messages.create(mailgunDomain, {
      from: fromEmail,
      to: toRecipients,
      "h:Reply-To": email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message || "(no message)"}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${(message || "(no message)").replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
