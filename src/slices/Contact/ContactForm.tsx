"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { RichTextField, KeyTextField, LinkField } from "@prismicio/client";
import StyledButton from "@/components/ui/StyledButton";
import StyledInput from "@/components/ui/StyledInput";
import ContactFormSuccess from "./components/ContactFormSuccess";
import ContactFormError from "./components/ContactFormError";
import { submitContactForm } from "./utils/submitContactForm";
import {
  errorClass,
  formatAustralianPhone,
  getPrivacyLinkProps,
} from "./utils/formHelpers";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacy: boolean;
};

interface ContactFormProps {
  recipients: KeyTextField;
  successMessage: RichTextField;
  failureMessage: RichTextField;
  privacyPolicyLink?: LinkField;
  submitLabel?: KeyTextField;
}

export default function ContactForm({
  recipients,
  successMessage,
  failureMessage,
  privacyPolicyLink,
  submitLabel,
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const { url: privacyUrl, target: privacyTarget } =
    getPrivacyLinkProps(privacyPolicyLink);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const phoneField = register("phone", {
    required: "Phone number is required.",
  });

  const onSubmit = async (data: FormValues) => {
    if (!turnstileToken) return;

    setStatus("loading");

    const success = await submitContactForm({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      turnstileToken,
      recipients,
    });

    setStatus(success ? "success" : "error");
    if (success) reset();
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  };

  if (status === "success") {
    return (
      <ContactFormSuccess
        message={successMessage}
        onReset={() => setStatus("idle")}
      />
    );
  }

  if (status === "error") {
    return (
      <ContactFormError
        message={failureMessage}
        onReset={() => setStatus("idle")}
      />
    );
  }

  return (
    <div className="rounded-md bg-white py-6 px-4 md:p-10 shadow-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <StyledInput
          label="Full name"
          required
          {...register("name", { required: "Full name is required." })}
          error={errors.name}
        />

        <StyledInput
          label="Email address"
          type="email"
          required
          {...register("email", {
            required: "Email address is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address.",
            },
          })}
          error={errors.email}
        />

        <StyledInput
          label="Phone number"
          type="tel"
          required
          maxLength={12}
          {...phoneField}
          onChange={(e) => {
            e.target.value = formatAustralianPhone(e.target.value);
            phoneField.onChange(e);
          }}
          error={errors.phone}
        />

        <StyledInput
          label="Your message"
          type="textarea"
          {...register("message")}
          error={errors.message}
        />

        <div className="flex items-start gap-3">
          <input
            id="privacy"
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
            {...register("privacy", {
              required: "You must agree to the privacy policy.",
            })}
          />
          <label
            htmlFor="privacy"
            className="text-body-base cursor-pointer select-none"
          >
            I agree to your{" "}
            <a
              href={privacyUrl}
              target={privacyTarget}
              className="underline hover:text-primary transition-colors"
            >
              friendly privacy policy
            </a>
            .
          </label>
        </div>
        {errors.privacy && (
          <p className={errorClass}>{errors.privacy.message}</p>
        )}

        {siteKey && (
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        )}

        <StyledButton
          type="submit"
          variant="Primary"
          disabled={status === "loading"}
          className="w-full justify-center"
        >
          {status === "loading" ? "Sending…" : submitLabel || "Submit"}
        </StyledButton>
      </form>
    </div>
  );
}
