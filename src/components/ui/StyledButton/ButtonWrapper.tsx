"use client";

import { PrismicNextLink } from "@prismicio/next";
import { LinkField } from "@prismicio/client";
import Link from "next/link";

interface ButtonWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  link?: string;
  target?: string;
  field?: LinkField | null | undefined;
  type?: "button" | "submit" | "reset";
}

const ButtonWrapper = ({
  children,
  className = "",
  onClick,
  disabled,
  link,
  field,
  type,
  target,
}: ButtonWrapperProps) => {
  if (link && typeof link === "string" && link.startsWith("http")) {
    return (
      <a href={link} className={className} target={target} rel="noreferrer">
        {children}
      </a>
    );
  }
  if (link && typeof link === "string" && !link.startsWith("http")) {
    return (
      <Link href={link} className={className} target={target} rel="noreferrer">
        {children}
      </Link>
    );
  }
  if (field && typeof field === "object") {
    return (
      <PrismicNextLink field={field} className={className}>
        {children}
      </PrismicNextLink>
    );
  }
  return (
    <button
      disabled={disabled}
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonWrapper;
