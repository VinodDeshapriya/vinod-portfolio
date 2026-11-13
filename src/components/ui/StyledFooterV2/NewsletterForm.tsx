"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import StyledInput from "../StyledInput";
import StyledButton from "../StyledButton";

interface NewsletterFormProps {
  isDark?: boolean;
}

type FormValues = {
  email: string;
};

const NewsletterForm = ({ isDark = true }: NewsletterFormProps) => {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = () => {
    setStatus("success");
    reset();
  };

  return (
    <div className="max-w-[560px]">
      <p
        className={clsx(
          "text-title-base-blog font-title font-medium mb-3",
          isDark ? "text-text-light" : "text-text-heading",
        )}
      >
        Newsletter
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={
          isDark
            ? "flex items-start w-full rounded-sm text-body-base text-text-heading bg-white placeholder:text-text-placeholder outline-0 focus:outline-2 focus:outline-primary-light transition-colors"
            : "flex items-start w-full rounded-sm text-body-base text-text-heading bg-offwhite-2 placeholder:text-text-placeholder outline-0 focus:outline-2 focus:outline-primary-light transition-colors"
        }
      >
        <div className="flex-1 min-w-0">
          <StyledInput
            label="Email address"
            labelClassName="sr-only"
            type="email"
            placeholder="Your email address..."
            className={
              isDark
                ? "w-full rounded-sm px-4 py-3 text-body-base text-text-heading bg-white placeholder:text-text-placeholder outline-0 focus:outline-2 focus:outline-primary-light transition-colors"
                : "w-full rounded-sm px-4 py-3 text-body-base text-text-heading bg-offwhite-2 placeholder:text-text-placeholder outline-0 focus:outline-2 focus:outline-primary-light transition-colors"
            }
            error={errors.email}
            {...register("email", {
              required: "Email address is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
        </div>
        <StyledButton
          type="submit"
          variant="Primary"
          className="shrink-0 w-fit! min-w-auto! rounded-sm! px-8!"
        >
          Submit
        </StyledButton>
      </form>
      <p className="mt-2 text-body-small-s">
        {status === "success"
          ? "Thanks for subscribing!"
          : "No spam, unsubscribe at any time."}
      </p>
    </div>
  );
};

export default NewsletterForm;
