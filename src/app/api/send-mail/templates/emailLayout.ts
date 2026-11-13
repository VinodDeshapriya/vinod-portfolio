export const header = (title: string, logoUrl?: string | null) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    ${
      logoUrl
        ? `<tr>
      <td align="left" style="padding: 32px 32px 0 0;">
        <img
          src="${logoUrl}"
          alt=""
          style="display: block; border: 0; outline: none; text-decoration: none; height: 40px; width: auto;"
        />
      </td>
    </tr>`
        : ""
    }
    <tr>
      <td align="left" style="padding: ${logoUrl ? "12px" : "32px"} 32px 0 0;">
        <p style="margin: 0; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #667085;">
          ${title}
        </p>
      </td>
    </tr>
  </table>
`;

export const footer = (logoUrl?: string | null) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 32px 32px 32px 0;" role="presentation">
    ${
      logoUrl
        ? `<tr>
      <td style="padding-bottom: 16px;">
        <img
          src="${logoUrl}"
          alt=""
          style="display: block; border: 0; outline: none; text-decoration: none; height: 32px; width: auto;"
        />
      </td>
    </tr>`
        : ""
    }
    <tr>
      <td style="border-top: 1px solid #dddddd; padding-top: 16px; font-size: 12px; color: #667085;">
        © ${new Date().getFullYear()} All rights reserved.
      </td>
    </tr>
  </table>
`;
