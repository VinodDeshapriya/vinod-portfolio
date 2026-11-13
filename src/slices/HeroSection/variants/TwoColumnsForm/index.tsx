import { Content, KeyTextField } from "@prismicio/client";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle from "@/components/ui/StyledSectionTitle";
import GoogleReviewsBadge from "../../components/GoogleReviewsBadge";
import fetchGoogleReviews from "../../components/fetchGoogleReviews";
import HeroContactForm from "./HeroContactForm";

type Props = {
  slice: Extract<Content.HeroSectionSlice, { variation: "twoColumnsForm" }>;
  clientId?: KeyTextField;
};

/**
 * Two-column hero: the left side is the "Two Columns" variation's (eyebrow,
 * title, description, buttons, Google reviews); the right side is a contact
 * form with file upload. Stacked below xl.
 */
const TwoColumnsForm = async ({ slice, clientId }: Props) => {
  const { reviewScore, totalReviewsCount } =
    slice.primary.show_google_reviews && clientId
      ? await fetchGoogleReviews(clientId)
      : {};

  const {
    email_recippients,
    success_message,
    failure_message,
    privacy_policy_link,
    submit_button_label,
  } = slice.primary;

  return (
    <StyledContainer slice={slice}>
      <div className="grid gap-(--spacing-space-1) grid-cols-1 xl:grid-cols-2 items-center">
        <div>
          <StyledSectionTitle slice={slice} isHero leftAlign="xl" />
          <GoogleReviewsBadge
            reviewScore={reviewScore}
            totalReviewsCount={totalReviewsCount}
            alignFrom="xl"
          />
        </div>
        <div className="w-full max-w-266 mx-auto">
          <HeroContactForm
            recipients={email_recippients}
            successMessage={success_message}
            failureMessage={failure_message}
            privacyPolicyLink={privacy_policy_link}
            submitLabel={submit_button_label}
          />
        </div>
      </div>
    </StyledContainer>
  );
};

export default TwoColumnsForm;
