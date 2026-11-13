"use client";

import { ReactNode, useId, useRef, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { KeyTextField, LinkField, RichTextField } from "@prismicio/client";
import clsx from "clsx";
import StyledButton from "@/components/ui/StyledButton";
// Shared with the Contact slice, so both forms format, label and report the same way
import ContactFormSuccess from "@/slices/Contact/components/ContactFormSuccess";
import EnquiryFormError from "@/slices/Contact/components/EnquiryFormError";
import {
  errorClass,
  formatAustralianPhone,
  getPrivacyLinkProps,
} from "@/slices/Contact/utils/formHelpers";
import FileUploadField from "./FileUploadField";
import { submitHeroForm } from "./submitHeroForm";

type FormValues = {
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  privacy: boolean;
};

interface HeroContactFormProps {
  recipients: KeyTextField;
  successMessage: RichTextField;
  failureMessage: RichTextField;
  privacyPolicyLink?: LinkField;
  submitLabel?: KeyTextField;
}

const inputClass =
  "w-full rounded-[6px] border-[0.5px] border-text-inactive bg-offwhite-2 px-3 py-3 text-body-base text-text-heading outline-none transition-colors focus:border focus:border-primary-light aria-invalid:border-red-500 md:px-4.5";

const Field = ({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: FieldError;
  className?: string;
  children: ReactNode;
}) => (
  <div className={className}>
    <label htmlFor={id} className="mb-2 block text-body-base text-text-heading">
      {label}
      {required && <span className="text-error-primary">*</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className={errorClass}>
        {error.message}
      </p>
    )}
  </div>
);

/**
 * Right side of the Hero "Two Columns with Form" variation. Sends to the same
 * /api/send-mail endpoint as the Contact forms, with up to two attached files.
 * On success it replaces the form with the success card and the configured
 * message, so the visitor stays on the page; on failure it shows the error
 * card and keeps what was typed (and the chosen files) for a resubmit.
 */
export default function HeroContactForm({
  recipients,
  successMessage,
  failureMessage,
  privacyPolicyLink,
  submitLabel,
}: HeroContactFormProps) {
  const uid = useId();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileMissing, setTurnstileMissing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [filesResetKey, setFilesResetKey] = useState(0);

  const { url: privacyUrl, target: privacyTarget } =
    getPrivacyLinkProps(privacyPolicyLink);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const id = (name: string) => `${uid}-${name}`;
  const describedBy = (name: keyof FormValues) =>
    errors[name] ? { "aria-describedby": `${id(name)}-error` } : {};

  const phoneField = register("phone", {
    required: "Phone number is required.",
  });

  const onSubmit = async (data: FormValues) => {
    // With Turnstile configured, wait for the check; without it (local dev)
    // submit anyway so the server's response drives the error state
    if (siteKey && !turnstileToken) {
      setTurnstileMissing(true);
      return;
    }
    setTurnstileMissing(false);
    setStatus("loading");

    const success = await submitHeroForm({
      name: data.name,
      business: data.business,
      email: data.email,
      phone: data.phone,
      address: data.address,
      message: data.message ?? "",
      files,
      turnstileToken,
      recipients,
    });

    turnstileRef.current?.reset();
    setTurnstileToken(null);

    if (!success) {
      setStatus("error");
      return;
    }

    reset();
    setFiles([]);
    setFilesResetKey((key) => key + 1);
    setStatus("success");
  };

  if (status === "success") {
    return (
      <ContactFormSuccess
        message={successMessage}
        onReset={() => setStatus("idle")}
      />
    );
  }

  return (
    <>
      {status === "error" && (
        <EnquiryFormError
          message={failureMessage}
          onReset={() => setStatus("idle")}
        />
      )}

      {/* Stays mounted (hidden) while the error shows, so values and files survive a resubmit */}
      <div
        className={clsx(
          "rounded-(--radius-md) border border-border-primary bg-offwhite px-4 py-6 md:p-10",
          status === "error" && "hidden",
        )}
      >
        <form
          // Built per submit event, so refs are only read inside the handler
          onSubmit={(e) => handleSubmit(onSubmit)(e)}
          noValidate
          className="flex flex-col gap-4"
        >
          {/* Pairs stay side by side at every width, as in the design */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            <Field
              id={id("name")}
              label="Full name"
              required
              error={errors.name}
            >
              <input
                id={id("name")}
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...describedBy("name")}
                className={clsx(inputClass, "h-12.5")}
                {...register("name", { required: "Full name is required." })}
              />
            </Field>

            <Field
              id={id("business")}
              label="Business name"
              required
              error={errors.business}
            >
              <input
                id={id("business")}
                autoComplete="organization"
                aria-invalid={!!errors.business}
                {...describedBy("business")}
                className={clsx(inputClass, "h-12.5")}
                {...register("business", {
                  required: "Business name is required.",
                })}
              />
            </Field>

            <Field
              id={id("email")}
              label="Email address"
              required
              error={errors.email}
            >
              <input
                id={id("email")}
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...describedBy("email")}
                className={clsx(inputClass, "h-12.5")}
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address.",
                  },
                })}
              />
            </Field>

            <Field
              id={id("phone")}
              label="Phone number"
              required
              error={errors.phone}
            >
              <input
                id={id("phone")}
                type="tel"
                autoComplete="tel"
                maxLength={12}
                aria-invalid={!!errors.phone}
                {...describedBy("phone")}
                className={clsx(inputClass, "h-12.5")}
                {...phoneField}
                onChange={(e) => {
                  e.target.value = formatAustralianPhone(e.target.value);
                  phoneField.onChange(e);
                }}
              />
            </Field>

            <Field
              id={id("address")}
              label="Your address"
              required
              error={errors.address}
              className="col-span-2"
            >
              <input
                id={id("address")}
                autoComplete="street-address"
                aria-invalid={!!errors.address}
                {...describedBy("address")}
                className={clsx(inputClass, "h-12.5")}
                {...register("address", {
                  required: "Your address is required.",
                })}
              />
            </Field>

            <Field
              id={id("message")}
              label="Your message"
              error={errors.message}
              className="col-span-2"
            >
              <textarea
                id={id("message")}
                rows={4}
                className={clsx(inputClass, "min-h-29.5")}
                {...register("message")}
              />
            </Field>
          </div>

          <FileUploadField key={filesResetKey} onFilesChange={setFiles} />

          <div>
            <div className="flex items-center gap-3">
              <input
                id={id("privacy")}
                type="checkbox"
                aria-invalid={!!errors.privacy}
                {...describedBy("privacy")}
                className="size-5 shrink-0 cursor-pointer rounded-[6px] accent-primary-light md:size-6"
                {...register("privacy", {
                  required: "You must agree to the privacy policy.",
                })}
              />
              <label
                htmlFor={id("privacy")}
                className="cursor-pointer select-none text-body-base text-text-heading"
              >
                I agree to the{" "}
                <a
                  href={privacyUrl}
                  target={privacyTarget}
                  className="underline transition-colors hover:text-primary-light"
                >
                  privacy policy
                </a>
                .
              </label>
            </div>
            {errors.privacy && (
              <p id={`${id("privacy")}-error`} className={errorClass}>
                {errors.privacy.message}
              </p>
            )}
          </div>

          {siteKey && (
            <Turnstile
              ref={turnstileRef}
              siteKey={siteKey}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setTurnstileMissing(false);
              }}
              onExpire={() => setTurnstileToken(null)}
              onError={() => setTurnstileToken(null)}
            />
          )}
          {turnstileMissing && (
            <p className={errorClass} role="alert">
              Please complete the verification above.
            </p>
          )}

          <StyledButton
            type="submit"
            variant="Primary"
            disabled={status === "loading"}
            className="w-full justify-center disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : submitLabel || "Submit"}
          </StyledButton>
        </form>
      </div>
    </>
  );
}
