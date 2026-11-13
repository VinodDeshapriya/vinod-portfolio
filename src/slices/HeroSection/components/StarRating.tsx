interface StarRatingProps {
  rating?: number;
  size?: number;
}

const StarFilled = ({ size, color }: { size: number; color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const StarHalf = ({ size, color }: { size: number; color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77V2z" />
    <path
      d="M12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2"
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
  </svg>
);

const StarRating = ({ rating = 0, size = 18 }: StarRatingProps) => {
  if (isNaN(rating)) return null;

  return (
    <div className="flex">
      {Array.from({ length: Math.floor(rating) }).map((_, index) => (
        <span key={index} className="me-px">
          <StarFilled size={size} color={"#fcbf02"} />
        </span>
      ))}
      {rating % 1 < 0.5 && rating % 1 > 0 && (
        <StarHalf size={size} color={"#fcbf02"} />
      )}
      {rating % 1 > 0.5 && <StarFilled size={size} color={"#fcbf02"} />}
    </div>
  );
};

export default StarRating;
