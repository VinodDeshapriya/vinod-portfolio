"use client";

import { ReactNode, useId, useRef, useState } from "react";
import { useForm, useWatch, FieldError } from "react-hook-form";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { KeyTextField, LinkField, RichTextField } from "@prismicio/client";
import clsx from "clsx";
import ContactFormSuccess from "./ContactFormSuccess";
import EnquiryFormError from "./EnquiryFormError";
import { submitEnquiryForm } from "../utils/submitEnquiryForm";
import {
  errorClass,
  formatAustralianPhone,
  getPrivacyLinkProps,
} from "../utils/formHelpers";

type FormValues = {
  name: string;
  business: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  message: string;
  privacy: boolean;
};

interface EnquiryFormFieldsProps {
  services: string[];
  recipients: KeyTextField;
  successMessage: RichTextField;
  failureMessage: RichTextField;
  privacyPolicyLink?: LinkField;
  submitLabel?: KeyTextField;
}

// Figma "Input Field": 0.5px #8C8C8C border, 6px radius, 18/12 padding, dark 1px border on focus;
// single-line inputs are 50px tall (h-12.5 where used — not on the message box)
const inputClass =
  "w-full rounded-[6px] border-[0.5px] border-text-inactive bg-white px-4.5 py-3 text-body-base text-text-heading outline-none transition-colors focus:border focus:border-primary aria-invalid:border-red-500";

const Label = ({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <label htmlFor={htmlFor} className="block text-body-base text-text-heading">
    {children}
    {required && <span className="text-[#F5222D]">*</span>}
  </label>
);

const FieldErrorText = ({ id, error }: { id: string; error?: FieldError }) =>
  error ? (
    <p id={id} className={errorClass}>
      {error.message}
    </p>
  ) : null;

/**
 * Client form for the Contact "Enquiry Form" variation. On success it shows
 * the success card; on failure it shows the error card and keeps the typed
 * values for a resubmit.
 */
export default function EnquiryFormFields({
  services,
  recipients,
  successMessage,
  failureMessage,
  privacyPolicyLink,
  submitLabel,
}: EnquiryFormFieldsProps) {
  const uid = useId();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileMissing, setTurnstileMissing] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const { url: privacyUrl, target: privacyTarget } =
    getPrivacyLinkProps(privacyPolicyLink);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { services: [] } });
  const selectedServices = useWatch({ control, name: "services" }) ?? [];

  const id = (name: string) => `${uid}-${name}`;
  const describedBy = (name: keyof FormValues) =>
    errors[name] ? { "aria-describedby": id(`${name}-error`) } : {};

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

    const success = await submitEnquiryForm({
      name: data.name,
      business: data.business,
      email: data.email,
      phone: data.phone,
      address: data.address,
      service: data.services.join(", "),
      message: data.message,
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

      {/* Stays mounted (hidden) while the error shows, so values survive a resubmit */}
      <div
        className={clsx(
          "rounded-(--radius-md) bg-white px-4 py-6 md:p-10",
          status === "error" && "hidden",
        )}
      >
        <form
          // Built per submit event, so refs are only read inside the handler
          onSubmit={(e) => handleSubmit(onSubmit)(e)}
          noValidate
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor={id("name")} required>
                Full name
              </Label>
              <input
                id={id("name")}
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...describedBy("name")}
                className={clsx(inputClass, "h-12.5")}
                {...register("name", { required: "Full name is required." })}
              />
              <FieldErrorText id={id("name-error")} error={errors.name} />
            </div>

            <div>
              <Label htmlFor={id("business")} required>
                Business name
              </Label>
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
              <FieldErrorText
                id={id("business-error")}
                error={errors.business}
              />
            </div>

            <div>
              <Label htmlFor={id("email")} required>
                Email address
              </Label>
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
              <FieldErrorText id={id("email-error")} error={errors.email} />
            </div>

            <div>
              <Label htmlFor={id("phone")} required>
                Phone number
              </Label>
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
              <FieldErrorText id={id("phone-error")} error={errors.phone} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={id("address")} required>
                Your address
              </Label>
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
              <FieldErrorText id={id("address-error")} error={errors.address} />
            </div>

            {services.length > 0 && (
              <fieldset className="md:col-span-2" {...describedBy("services")}>
                <legend className="mb-2 text-body-base text-text-heading">
                  Services<span className="text-[#F5222D]">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {services.map((service, index) => {
                    const checked = selectedServices.includes(service);
                    // An odd last option (e.g. "Other") spans the full row, as in the design
                    const isLastOdd =
                      index === services.length - 1 && services.length % 2 === 1;
                    return (
                      <label
                        key={service}
                        className={clsx(
                          "flex cursor-pointer items-center justify-center rounded-[48px] px-4.5 py-3 text-center text-body-base transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary",
                          checked
                            ? "bg-[#1E1C18] text-white"
                            : "bg-offwhite text-text-description hover:bg-[#EAEAEC]",
                          isLastOdd && "md:col-span-2",
                        )}
                      >
                        {/* Checkboxes: several services can be picked, at least one required */}
                        <input
                          type="checkbox"
                          value={service}
                          className="sr-only"
                          {...register("services", {
                            validate: (value) =>
                              (Array.isArray(value) && value.length > 0) ||
                              "Please choose at least one service.",
                          })}
                        />
                        {service}
                      </label>
                    );
                  })}
                </div>
                <FieldErrorText
                  id={id("services-error")}
                  error={errors.services as FieldError | undefined}
                />
              </fieldset>
            )}

            <div className="md:col-span-2">
              <Label htmlFor={id("message")}>Your message</Label>
              <textarea
                id={id("message")}
                rows={4}
                className={clsx(inputClass, "min-h-29.5")}
                {...register("message")}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start gap-3">
                <input
                  id={id("privacy")}
                  type="checkbox"
                  aria-invalid={!!errors.privacy}
                  {...describedBy("privacy")}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded-[6px] accent-primary md:size-6"
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
                    className="underline transition-colors hover:text-primary"
                  >
                    privacy policy
                  </a>
                  .
                </label>
              </div>
              <FieldErrorText id={id("privacy-error")} error={errors.privacy} />
            </div>
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

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary text-body-base-bold w-full justify-center disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : submitLabel || "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
