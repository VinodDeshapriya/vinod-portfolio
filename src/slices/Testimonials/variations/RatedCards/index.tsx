import { Content } from "@prismicio/client";
import RatedTestimonialsCarousel from "../components/RatedTestimonialsCarousel";
import { type RatedTestimonial } from "../components/RatedTestimonialCard";

type Props = {
  slice: Extract<Content.TestimonialsSlice, { variation: "ratedCards" }>;
};

const RatedCards = ({ slice }: Props) => {
  const testimonials = slice.primary.testimonials ?? [];

  const items: RatedTestimonial[] = testimonials
    .filter((item) => !!item.testimonial)
    .map((item) => ({
      name: String(item.name ?? ""),
      role: item.role ? String(item.role) : undefined,
      quote: String(item.testimonial ?? ""),
      rating: typeof item.rating === "number" ? item.rating : 5,
    }));

  if (!items.length) return null;

  return <RatedTestimonialsCarousel testimonials={items} />;
};

export default RatedCards;
