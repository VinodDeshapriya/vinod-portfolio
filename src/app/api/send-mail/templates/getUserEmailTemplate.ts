import { header, footer } from "./emailLayout";
import type { ContactFormValues, EmailLogos } from "./getAdminEmailTemplate";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const getUserEmailTemplate = (
  values: ContactFormValues,
  logos: EmailLogos = {},
) => {
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>We've received your message</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div style="background-color: #f5f5f7; font-family: Arial, sans-serif;">
          <div style="max-width: 576px; margin: 0 auto; padding: 32px;">
            ${header("Thanks for reaching out", logos.headerLogoUrl)}
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
              <tr>
                <td style="font-size: 16px; line-height: 26px; color: #333333; padding: 32px; background-color: white; border-radius: 14px; border: 1px solid #EAE8F2;">
                  <p style="margin: 0 0 12px;">Hi ${escapeHtml(values.name || "there")},</p>
                  <p style="margin: 0 0 12px;">Thanks for getting in touch. We've received your message and someone from our team will get back to you shortly.</p>
                  <p style="margin: 20px 0 0;">Talk soon.</p>
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
