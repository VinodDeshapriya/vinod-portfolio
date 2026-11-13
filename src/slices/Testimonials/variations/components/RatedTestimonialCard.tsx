import StarRating from "./StarRating";

export interface RatedTestimonial {
  name: string;
  role?: string;
  quote: string;
  rating: number;
}

interface RatedTestimonialCardProps {
  item: RatedTestimonial;
}

const RatedTestimonialCard = ({ item }: RatedTestimonialCardProps) => {
  const { name, role, quote, rating } = item;

  return (
    <div className="flex h-full w-full flex-col !rounded-[20px] border border-[#CAE4E5] bg-[#D2E5E7]/30 p-6 md:p-8">
      <StarRating
        rating={rating}
        color="#f59e0b"
        size={20}
        className="flex mb-4"
      />
      <p className="text-body-base font-normal text-text-heading">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto">
        <hr className="my-6 border-[#ADDADC]" />
        <p className="text-body-base-bold text-text-heading !font-bold ">{name}</p>
        {role && <p className="text-body-x-small text-text-description">{role}</p>}
      </div>
    </div>
  );
};

export default RatedTestimonialCard;
