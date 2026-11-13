"use client";

import { useState } from "react";
import ShareSocialFIll from "atd-icons/dist/ShareSocialFIll";
import clsx from "clsx";

interface ShareButtonProps {
  title?: string;
  url?: string;
  className?: string;
}

const ShareButton = ({ title, url, className }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // User cancelled the share sheet, nothing to do.
      }
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={clsx(
        "inline-flex items-center gap-3 text-body-medium text-info-primary hover:text-[color-mix(in_srgb,var(--color-info-primary)_80%,black)] transition-colors",
        className,
      )}
    >
      <ShareSocialFIll size={32} />
      {copied ? "Copied!" : "Share"}
    </button>
  );
};

export default ShareButton;
