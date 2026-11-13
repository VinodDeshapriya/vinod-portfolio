import ReviewCard, { type CarouselItem } from "./ReviewCard";

interface ReviewDetailsModalProps {
  close: () => void;
  review: CarouselItem;
}

const ReviewDetailsModal = ({ close, review }: ReviewDetailsModalProps) => {
  return (
    <dialog
      open
      className={
        "bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 w-full h-screen z-999999 flex items-center justify-center"
      }
      onClick={close}
    >
      <div
        className={
          "flex w-[90%] max-h-[90vh] max-w-125 bg-white rounded-[12px] relative"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className={
            "absolute top-0 right-0 rounded-[10px] h-10 w-10 flex items-center justify-center bg-white"
          }
        >
          &#x2715;
        </button>
        <div className={"p-4 md:p-6 lg:p-8 grow overflow-auto"}>
          <ReviewCard item={review} />
        </div>
      </div>
    </dialog>
  );
};

export default ReviewDetailsModal;
