import axios from "axios";

interface GoogleReviewsData {
  reviewScore?: number;
  totalReviewsCount?: number;
}

const fetchGoogleReviews = async (
  clientId: string,
): Promise<GoogleReviewsData> =>
  axios
    .post("https://api.atdigital.io/google-reviews", { sheetId: clientId })
    .then((res) => res.data)
    .catch(() => ({}));

export default fetchGoogleReviews;
