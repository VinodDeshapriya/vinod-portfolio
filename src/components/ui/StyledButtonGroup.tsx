import { LinkField } from "@prismicio/client";
import StyledButton, { ButtonVariantName } from "./StyledButton";
import clsx from "clsx";

interface Button {
  label?: string;
  link?: LinkField;
  variant?: ButtonVariantName;
  url?: string;
  text?: string;
  target?: string;
}

interface StyledButtonGroupProps {
  slice?: {
    primary?: {
      buttons?: Button[];
    };
  };
  className?: string;
  leftAlign?: boolean | "md" | "xl";
}

const StyledButtonGroup = ({
  slice,
  className = "",
  leftAlign = false,
}: StyledButtonGroupProps) => {
  const buttons =
    slice?.primary?.buttons?.filter(
      (button) => !!button.text && !!button.url,
    ) ?? [];

  if (!buttons.length) return null;

  return (
    <div
      className={clsx({
        "flex flex-wrap gap-4 flex-col md:flex-row": true,
        [className]: true,
        "justify-center": leftAlign !== true,
        "md:justify-start": leftAlign === "md",
        "xl:justify-start": leftAlign === "xl",
        "w-full max-w-130 md:w-auto md:max-w-none": true,
        "mx-auto md:mx-0": leftAlign !== true,
      })}
    >
      {buttons?.map((button, index) => {
        return (
          <StyledButton
            key={index}
            link={button.url}
            variant={button.variant}
            target={button.target}
          >
            {button.text}
          </StyledButton>
        );
      })}
    </div>
  );
};

export default StyledButtonGroup;
