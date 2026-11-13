interface DetermineRecipientParams {
  recipient: string;
  cc?: string;
  bcc?: string;
}

interface DetermineRecipientResult {
  recipient: string;
  cc?: string;
  bcc?: string;
}

export function determineRecipient({
  recipient,
  cc = "",
  bcc = "",
}: DetermineRecipientParams): DetermineRecipientResult {
  const isProduction = process.env.NEXT_PUBLIC_STAGE === "production";

  if (!isProduction) {
    return { recipient: process.env.MAIL_TEST_INBOX || "forms@atdigital.io" };
  }

  return { recipient, cc, bcc };
}
