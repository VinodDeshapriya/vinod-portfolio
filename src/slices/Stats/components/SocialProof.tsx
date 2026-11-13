import { Content } from "@prismicio/client";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledSectionTitle, {
  isEmptyTitleSection,
} from "@/components/ui/StyledSectionTitle";
import AnimatedNumber from "./AnimatedNumber";

type Props = {
  slice: Extract<Content.StatsSlice, { variation: "socialProof" }>;
};

/**
 * Figma `social_proof_variants1`, the "Icon=small text" variant
 * (node 15323:20985) — a dark band of headline figures.
 *
 * Deliberately separate from the `default` / `darkBg` markup in `index.tsx`:
 * those two share `Stats.module.css`, whose `.item` rule draws a vertical rule
 * between figures and whose `.hasDarkBg` forces every descendant white. This
 * design has neither, and that stylesheet serves both existing variations.
 *
 * In this project `--color-primary-dark` is the design's near-black (`#0d0d0d`),
 * so the band uses `bg-primary-dark`. (The source project this was copied from
 * has a green `--color-primary-dark` and used `--color-secondary-dark` instead;
 * here that token is a dark maroon.)
 *
 * Vertical padding is fixed at the design's 60 / 80 / 40, so this variation
 * has no Top/Bottom padding selects and no background toggle.
 */
const SocialProof = ({ slice }: Props) => {
  const { stats, animate_numbers } = slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-primary-dark text-text-light py-15 md:py-20 lg:py-10"
    >
      <StyledContainer>
        <StyledSectionTitle slice={slice} invertedColors />

        <div
          className={clsx(
            "grid grid-cols-2 gap-x-4 gap-y-8 md:gap-15 lg:grid-cols-4 lg:gap-8",
            { "mt-8 lg:mt-12": !isEmptyTitleSection(slice) },
          )}
        >
          {stats?.map(({ value, suffix }, idx) => (
            <div key={idx} className="text-center">
              <p className="text-title-x-large">
                {animate_numbers ? <AnimatedNumber value={value} /> : value}
              </p>
              <p className="text-body-base">{suffix}</p>
            </div>
          ))}
        </div>
      </StyledContainer>
    </section>
  );
};

export default SocialProof;
