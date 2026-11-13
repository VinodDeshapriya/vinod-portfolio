import { DM_Sans, Outfit } from "next/font/google";

/**
 * Portfolio design-system faces, scoped to this variation only. The site-wide
 * tokens in src/app/fonts.ts still carry the starter template's Barlow / Inter;
 * once the portfolio Figma variables are synced there, these can go.
 */
export const portfolioTitle = Outfit({
  variable: "--font-portfolio-title",
  subsets: ["latin"],
  weight: ["400"],
});

export const portfolioBody = DM_Sans({
  variable: "--font-portfolio-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});
