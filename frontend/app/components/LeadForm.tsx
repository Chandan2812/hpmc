"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { useLeadFormSettings } from "../hooks/useLeadFormSettings";
import LeadCustomFields, {
  type LeadCustomFieldValue,
  type LeadCustomFieldValues,
} from "./LeadCustomFields";

const productOptions = [
  { value: "Single Screw Extruder", label: "Single Screw Extruder" },
  { value: "Twin Screw Extruder", label: "Twin Screw Extruder" },
  {
    value: "PVC Conduit Pipe Plant (Four Pipes)",
    label: "PVC Conduit Pipe Plant (Four Pipes)",
  },
  {
    value: "PVC Conduit Pipe Plant (Two Pipes)",
    label: "PVC Conduit Pipe Plant (Two Pipes)",
  },
  {
    value: "High Speed HDPE Pipe Plant",
    label: "High Speed HDPE Pipe Plant",
  },
  {
    value: "Twin Screw Plant for PVC Compounding",
    label: "Twin Screw Plant for PVC Compounding",
  },
  {
    value: "Single Screw Plant for PPR Pipe",
    label: "Single Screw Plant for PPR Pipe",
  },
  {
    value: "Two Stage Recycling Plant",
    label: "Two Stage Recycling Plant",
  },
  {
    value: "Vented Recycling Plant",
    label: "Vented Recycling Plant",
  },
  {
    value: "Recycling Plant With Compactor",
    label: "Recycling Plant With Compactor",
  },
  {
    value: "Soft Cable Grade PVC Compounding Plant",
    label: "Soft Cable Grade PVC Compounding Plant",
  },
  {
    value: "Corotating Twin Screw Extruder",
    label: "Corotating Twin Screw Extruder",
  },
  {
    value: "Corotating Triple Screw Extruder",
    label: "Corotating Triple Screw Extruder",
  },
  {
    value: "High Speed Two Layer Cable Plant",
    label: "High Speed Two Layer Cable Plant",
  },
  {
    value: "Twin Screw Plant for PVC Trunking",
    label: "Twin Screw Plant for PVC Trunking",
  },
  {
    value: "Single Screw Plant for PVC Profile",
    label: "Single Screw Plant for PVC Profile",
  },
  {
    value: "Twin Screw Plant for PVC Profile",
    label: "Twin Screw Plant for PVC Profile",
  },
  {
    value: "Single Screw Plant for Garden Pipe",
    label: "Single Screw Plant for Garden Pipe",
  },
  {
    value: "LLDPE Pipe Plant",
    label: "LLDPE Pipe Plant",
  },
  {
    value: "Twin Screw Plant for CPVC Pipe",
    label: "Twin Screw Plant for CPVC Pipe",
  },
];

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  message: string;
};

interface LeadFormProps {
  onSuccess?: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const { leadForm, loading: leadFormLoading } = useLeadFormSettings();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState("");
  const [currentStep, setCurrentStep] = useState<"form" | "otp" | "success">(
    "form",
  );

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customFieldValues, setCustomFieldValues] =
    useState<LeadCustomFieldValues>({});

  const inputStyle = {
    background: "var(--background)",
    color: "var(--text-primary)",
    borderColor: "var(--border)",
  };

  const handleChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCustomFieldChange = (
    fieldId: string,
    value: LeadCustomFieldValue,
  ) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least one service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    leadForm.customFields.forEach((field) => {
      const value = customFieldValues[field.id];

      if (field.required) {
        const isEmpty =
          field.type === "checkbox"
            ? !value
            : !String(value || "").trim();

        if (isEmpty) {
          newErrors[field.id] = `${field.label} is required`;
          return;
        }
      }

      if (
        field.type === "email" &&
        value &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(value))
      ) {
        newErrors[field.id] = "Please enter a valid email";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    const leadCustomFields: LeadCustomFieldValues = {
      ...customFieldValues,
      ...(formData.company.trim() ? { companyName: formData.company } : {}),
      ...(selectedServices.length ? { products: selectedServices } : {}),
    };

    try {
      setLoading(true);
      setServerError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/lead/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            companyName: formData.company,
            products: selectedServices,
            message: formData.message,
            customFields: leadCustomFields,
          }),
        },
      );

      const data = await response.json();

      if (data.alreadyRegistered) {
        onSuccess?.();
        setServerError(data.message || "Email already registered.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // save user verification
      localStorage.setItem(
        "catalogue_access",
        JSON.stringify({
          email: formData.email,
          verified: true,
        }),
      );

      setCurrentStep("otp");

      onSuccess?.();
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setServerError("Please enter OTP");
      return;
    }

    try {
      setOtpLoading(true);
      setServerError("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/lead/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setCurrentStep("success");

      onSuccess?.();

      setTimeout(() => {
        setCurrentStep("form");
      }, 2500);

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        message: "",
      });

      setSelectedServices([]);
      setCustomFieldValues({});
      setOtp("");
    } catch (error: unknown) {
      setServerError(getErrorMessage(error, "OTP verification failed"));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[var(--primary)]/10 blur-3xl" />

      <div className="relative grid gap-5 xl:grid-cols-[320px_1fr]">
        {/* LEFT PANEL */}
        <div
          className="hidden xl:block overflow-hidden rounded-[28px] border p-6 relative"
          style={{
            background: "var(--sidebar-bg)",
            borderColor: "var(--border)",
          }}
        >
          {/* Glow */}
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[var(--primary)]/10 blur-3xl" />

          <div className="relative z-10">
            <span
              className="rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "rgba(101,188,79,0.12)",
                color: "var(--primary)",
              }}
            >
              Why Choose HPMC
            </span>

            <h2
              className="mt-5 text-3xl font-bold leading-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Industrial Solutions
              <span className="block text-[var(--primary)]">You Can Trust</span>
            </h2>

            <p
              className="mt-4 leading-7"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Share your requirements and our specialists will connect with you
              within 24 hours.
            </p>

            <div className="mt-8 space-y-3">
              {[
                " 50+ Years of Experience ",
                "1000+ Successful Installations",
                "ISO Certified Manufacturing",
                "Global Export Presence",
                "End-to-End Technical Support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl p-3"
                  style={{
                    background: "var(--sidebar-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      background: "var(--primary)",
                    }}
                  >
                    ✓
                  </div>

                  <span
                    className="font-medium"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-8 rounded-2xl p-4"
              style={{
                background: "var(--sidebar-card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Average Response Time
              </p>

              <h3
                className="mt-1 text-2xl font-bold"
                style={{
                  color: "var(--primary)",
                }}
              >
                Within 24 Hours
              </h3>
            </div>
          </div>
        </div>

        {/* FORM */}
        {currentStep === "form" && (
          <>
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[28px] border p-4 md:p-6"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              {/* Progress */}
              <div className="mb-6 flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    1
                  </div>

                  <div className="h-[2px] w-12 bg-[var(--border)]" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)]">
                    2
                  </div>

                  <div className="h-[2px] w-12 bg-[var(--border)]" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)]">
                    ✓
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="mb-6 text-center">
                <span className="rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)]">
                  Quick Inquiry
                </span>

                <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                  Request a Consultation
                </h2>

                <p className="mt-2 text-sm md:text-base text-[var(--text-secondary)]">
                  Fill out the form and our experts will contact you shortly.
                </p>
              </div>

              {/* Error */}
              {serverError && (
                <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-500">
                  {serverError}
                </div>
              )}

              {/* Inputs */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                    style={inputStyle}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                    style={inputStyle}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div
                    className="rounded-2xl border px-4 py-4"
                    style={{
                      background: "var(--background)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={formData.phone}
                      onChange={(value) => handleChange("phone", value || "")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Services */}
              <div className="mt-8">
                <label className="mb-4 block font-semibold text-[var(--text-primary)]">
                  Select Products
                </label>

                <Select
                  isMulti
                  options={productOptions}
                  placeholder="Search and select products..."
                  value={productOptions.filter((option) =>
                    selectedServices.includes(option.value),
                  )}
                  onChange={(selected) =>
                    setSelectedServices(
                      selected ? selected.map((item) => item.value) : [],
                    )
                  }
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: "56px",
                      borderRadius: "16px",
                      borderColor: state.isFocused
                        ? "var(--primary)"
                        : "var(--border)",
                      backgroundColor: "var(--background)",
                      boxShadow: "none",
                      padding: "4px",
                    }),

                    menu: (base) => ({
                      ...base,
                      borderRadius: "16px",
                      overflow: "hidden",
                      backgroundColor: "var(--card)",
                      zIndex: 9999,
                    }),

                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "var(--primary)"
                        : state.isFocused
                          ? "rgba(101,188,79,0.1)"
                          : "transparent",
                      color: state.isSelected ? "#fff" : "var(--text-primary)",
                      cursor: "pointer",
                    }),

                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "rgba(101,188,79,0.12)",
                      borderRadius: "999px",
                      padding: "2px 4px",
                    }),

                    multiValueLabel: (base) => ({
                      ...base,
                      color: "var(--primary)",
                      fontWeight: 600,
                    }),

                    multiValueRemove: (base) => ({
                      ...base,
                      color: "var(--primary)",
                      ":hover": {
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                      },
                    }),

                    placeholder: (base) => ({
                      ...base,
                      color: "var(--text-secondary)",
                    }),

                    input: (base) => ({
                      ...base,
                      color: "var(--text-primary)",
                    }),

                    singleValue: (base) => ({
                      ...base,
                      color: "var(--text-primary)",
                    }),
                  }}
                />
                {errors.services && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.services}
                  </p>
                )}
              </div>

              <LeadCustomFields
                fields={leadForm.customFields}
                values={customFieldValues}
                errors={errors}
                inputStyle={inputStyle}
                loading={leadFormLoading}
                onChange={handleCustomFieldChange}
              />

              {/* Message */}
              <div className="mt-8">
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your requirements..."
                  className="w-full resize-none rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                  style={inputStyle}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || leadFormLoading}
                className="mt-5 w-full rounded-2xl bg-[var(--primary)] px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending OTP...
                  </div>
                ) : (
                  "Request Consultation"
                )}
              </button>
            </form>
          </>
        )}

        {/* STEP 2 */}
        {currentStep === "otp" && (
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10">
              📧
            </div>

            <span className="rounded-full bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)]">
              Step 2 of 2
            </span>

            <h2 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">
              Verify Your Email
            </h2>

            <p className="mt-3 max-w-md text-[var(--text-secondary)]">
              We have sent a verification code to
            </p>

            <p className="mt-1 font-semibold text-[var(--primary)]">
              {formData.email}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="
      mt-8
      w-full
      max-w-md
      rounded-2xl
      border
      p-5
      text-center
      text-4xl
      font-bold
      tracking-[12px]
      outline-none
      "
              style={inputStyle}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="
      mt-6
      w-full
      max-w-md
      rounded-2xl
      bg-green-600
      py-4
      font-semibold
      text-white
      "
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {currentStep === "success" && (
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-5xl text-white animate-bounce">
              ✓
            </div>

            <h2 className="mt-8 text-3xl font-bold text-green-600">
              Inquiry Submitted Successfully
            </h2>

            <p className="mt-4 text-[var(--text-secondary)]">
              Thank you for contacting HPMC.
            </p>

            <p className="text-[var(--text-secondary)]">
              Our team will connect with you shortly.
            </p>

            <div className="mt-6 text-sm text-[var(--text-secondary)]">
              Closing...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
