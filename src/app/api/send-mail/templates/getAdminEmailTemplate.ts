import { header, footer } from "./emailLayout";

export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message?: string;
  // Sent by the Contact "Enquiry Form" variation only
  business?: string;
  address?: string;
  service?: string;
  // Names of attached files, sent by the Hero "Two Columns with Form" variation only
  fileNames?: string[];
}

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatValueForHtml = (value: string) =>
  escapeHtml(value || "N/A").replaceAll("\n", "<br />");

const FIELD_LABELS: {
  key: keyof Omit<ContactFormValues, "fileNames">;
  label: string;
  optional?: boolean;
}[] = [
  { key: "name", label: "Name" },
  { key: "business", label: "Business", optional: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address", optional: true },
  { key: "service", label: "Services", optional: true },
  { key: "message", label: "Message" },
];

export interface EmailLogos {
  headerLogoUrl?: string | null;
  footerLogoUrl?: string | null;
}

export const getAdminEmailTemplate = (
  values: ContactFormValues,
  logos: EmailLogos = {},
) => {
  // Optional fields are listed only when sent, so the default form's email is unchanged
  const submittedDetails = FIELD_LABELS.filter(
    ({ key, optional }) => !optional || values[key],
  ).map(
    ({ key, label }) =>
      `<li style="margin-bottom: 6px;">${escapeHtml(label)}: ${formatValueForHtml(values[key] || "")}</li>`,
  ).join("");

  const fileNames = values.fileNames ?? [];
  const filesSection = fileNames.length
    ? `
      <p style="margin: 20px 0 10px; font-weight: bold;">Attached Files:</p>
      <ul style="padding-left: 20px; margin: 0;">
        ${fileNames
          .map(
            (name) =>
              `<li style="margin-bottom: 6px;">${escapeHtml(name)}</li>`,
          )
          .join("")}
      </ul>
    `
    : "";

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>New Contact Form Submission</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style="background-color: #f5f5f7; font-family: Arial, sans-serif;">
          <div style="max-width: 576px; margin: 0 auto; padding: 32px;">
            ${header("New Contact Form Submission", logos.headerLogoUrl)}
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="font-size: 16px; line-height: 26px; color: #333333; padding: 32px; background-color: white; border-radius: 14px; border: 1px solid #EAE8F2;">
                  <p style="margin: 0 0 12px;">A new inquiry has been submitted through the website's contact form.</p>
                  <p style="margin: 20px 0 10px; font-weight: bold;">Submitted Details:</p>
                  <ul style="padding-left: 20px; margin: 0;">
                    ${submittedDetails}
                  </ul>
                  ${filesSection}
                  <p style="margin: 20px 0 0;">Please follow up with this lead as soon as possible.</p>
                </td>
              </tr>
            </table>
            ${footer(logos.footerLogoUrl)}
          </div>
        </div>
      </body>
    </html>
  `;
};
