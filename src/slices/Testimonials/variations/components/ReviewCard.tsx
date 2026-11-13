import clsx from "clsx";
import StarRating from "./StarRating";

export interface CarouselItem {
  name: string;
  subtitle?: string;
  review: string;
  avatarUrl?: string;
  profileUrl?: string;
  score?: number;
}

interface ReviewCardProps {
  item?: CarouselItem;
  setReview?: () => void;
}

const ReviewCard = ({ item, setReview }: ReviewCardProps) => {
  if (!item?.review) return null;

  const { name, subtitle, score, review, avatarUrl, profileUrl } = item;
  const showReadMore = typeof setReview === "function" && review.length > 75;

  return (
    <>
      <a
        href={profileUrl}
        target={"_blank"}
        rel={"noreferrer"}
        className="flex items-center group"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            loading={"lazy"}
            className={
              "bg-[#eee] block w-10 h-10 rounded-full object-cover me-2 shrink-0"
            }
          />
        ) : (
          <p
            className={
              "bg-white block w-10 h-10 rounded-full leading-10 text-center me-2 shrink-0"
            }
          >
            {name?.[0]}
          </p>
        )}
        <div>
          <p className={"leading-[120%] text-label"}>{name}</p>
          {subtitle && (
            <span
              className={
                "block leading-[100%] text-[#595959] text-[12px] text-caption"
              }
            >
              {subtitle}
            </span>
          )}
        </div>
      </a>
      {score !== undefined && <StarRating rating={score} />}
      <div className="relative mt-3">
        <p className={clsx("text-body-base", { "line-clamp-4": showReadMore })}>
          {showReadMore
            ? review
            : review.split("\n").map((text, idx) => (
                <span className={"block mt-1 first:mt-0"} key={idx}>
                  {text}
                </span>
              ))}
        </p>
      </div>
      {showReadMore && (
        <button
          onClick={setReview}
          className={"text-caption font-bold! opacity-50 mt-1 underline"}
        >
          Read more
        </button>
      )}
    </>
  );
};

export default ReviewCard;
