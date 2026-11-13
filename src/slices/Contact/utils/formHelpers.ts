import { LinkField } from "@prismicio/client";

export const errorClass = "mt-1 text-body-small text-red-500";

export const formatAustralianPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const groups = [4, 3, 3];

  let result = "";
  let index = 0;
  for (const groupLength of groups) {
    const group = digits.slice(index, index + groupLength);
    if (!group) break;
    result += (result ? " " : "") + group;
    index += groupLength;
  }
  return result;
};

export const getPrivacyLinkProps = (privacyPolicyLink?: LinkField) => {
  const url =
    privacyPolicyLink && "url" in privacyPolicyLink
      ? (privacyPolicyLink as { url: string }).url
      : "#";
  const target =
    privacyPolicyLink && "target" in privacyPolicyLink
      ? ((privacyPolicyLink as { target?: string }).target as
          | "_blank"
          | undefined)
      : undefined;
  return { url, target };
};
