import { Content } from "@prismicio/client";
import ReviewsCarousel from "../components/ReviewsCarousel";
import { type CarouselItem } from "../components/ReviewCard";

type Props = {
  slice: Extract<Content.TestimonialsSlice, { variation: "default" }>;
};

const ManualEntries = ({ slice }: Props) => {
  const testimonials = slice.primary.testimonials ?? [];

  const items: CarouselItem[] = testimonials
    .filter((item) => !!item.testimonial)
    .map((item) => ({
      name: String(item.name ?? ""),
      subtitle: item.role ? String(item.role) : undefined,
      review: String(item.testimonial ?? ""),
      avatarUrl: item.image?.url ?? undefined,
    }));

  if (!items.length) return null;

  return (
    <ReviewsCarousel
      reviews={items}
      invertedBg={slice?.primary?.background_color}
    />
  );
};

export default ManualEntries;
