import Image from "next/image";
import clsx from "clsx";
import googleIcon from "./google-icon.png";
import StarRating from "./StarRating";

interface GoogleReviewsBadgeProps {
  reviewScore?: number;
  totalReviewsCount?: number;
  className?: string;
  alignFrom?: "lg" | "xl";
  invertedColors?: boolean;
}

const GoogleReviewsBadge = ({
  reviewScore,
  totalReviewsCount,
  className,
  alignFrom = "lg",
  invertedColors = false,
}: GoogleReviewsBadgeProps) => {
  if (!reviewScore) return null;

  return (
    <div
      className={`flex items-center gap-2 mt-6 justify-center ${alignFrom === "xl" ? "xl:justify-start" : "lg:justify-start"} ${className ?? ""}`}
    >
      <Image src={googleIcon} alt="Google" className="h-10 w-10 shrink-0" />
      <div className="flex flex-col gap-1">
        <StarRating rating={reviewScore} size={18} />
        <span
          className={clsx("text-body-small text-text-inactive", {
            "text-white!": invertedColors,
          })}
        >
          {reviewScore} Stars
          {totalReviewsCount ? ` | ${totalReviewsCount} Reviews` : ""}
        </span>
      </div>
    </div>
  );
};

export default GoogleReviewsBadge;
