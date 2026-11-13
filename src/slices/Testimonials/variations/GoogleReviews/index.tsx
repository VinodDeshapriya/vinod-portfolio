import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Content } from "@prismicio/client";
import ReviewsCarousel from "../components/ReviewsCarousel";
import ReviewsHeader from "../components/Header";
import { type CarouselItem } from "../components/ReviewCard";

type Props = {
  slice: Extract<Content.TestimonialsSlice, { variation: "googleReviews" }>;
};

export default async function GoogleReviews({ slice }: Props) {
  const clientId = slice.primary.client_id;

  const { reviews, reviewUrl, reviewScore, totalReviewsCount } = await axios
    .post("https://api.atdigital.io/google-reviews", { sheetId: clientId })
    .then((res) => res.data)
    .catch(() => ({}));

  const filteredReviews: CarouselItem[] = (reviews ?? [])
    .filter(
      (r: { Review: string; Score: number }) => !!r.Review && r.Score >= 4,
    )
    .map(
      (r: {
        Name: string;
        DateTime: string;
        Score: number;
        Review: string;
        ProfilePhotoUrl?: string;
        ReviewUrl?: string;
      }) => ({
        name: r.Name,
        subtitle: formatDateTime(r.DateTime),
        score: r.Score,
        review: r.Review,
        avatarUrl: r.ProfilePhotoUrl
          ? `${r.ProfilePhotoUrl.split("=")?.[0]}=s80-c-rp-mo`
          : undefined,
        profileUrl: r.ReviewUrl,
      }),
    );

  if (!filteredReviews.length) return null;

  return (
    <div className="mt-(--spacing-space-2)">
      <ReviewsHeader
        reviewUrl={reviewUrl}
        reviewScore={reviewScore}
        totalReviewsCount={totalReviewsCount}
        invertedBg={slice?.primary?.background_color}
      />
      <ReviewsCarousel
        reviews={filteredReviews}
        invertedBg={slice?.primary?.background_color}
      />
    </div>
  );
}

const formatDateTime = (time: string): string => {
  try {
    return formatDistanceToNow(new Date(time)) + " ago";
  } catch {
    return "";
  }
};
