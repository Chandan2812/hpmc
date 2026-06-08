"use client";

import { useEffect, useState } from "react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useSearchParams } from "next/navigation";

export default function SubmitResume() {
  const [openPopup, setOpenPopup] = useState(false);
  const searchParams = useSearchParams();

  const careerId = searchParams.get("careerId");

  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState<File | null>(null);
  const [careerTitle, setCareerTitle] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentLocation: "",
    experience: "",
    currentCompany: "",
    currentCTC: "",
    expectedCTC: "",
    noticePeriod: "",
    coverLetter: "",
  });

  useEffect(() => {
    const fetchCareer = async () => {
      if (!careerId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/career/${careerId}`,
        );

        const result = await res.json();

        if (result.success) {
          setCareerTitle(result.data?.title || "");
        }
      } catch (error) {
        console.error("Career Fetch Error:", error);
      }
    };

    fetchCareer();
  }, [careerId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("careerId", careerId || "");

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      data.append("currentLocation", formData.currentLocation);

      data.append("experience", formData.experience);

      data.append("currentCompany", formData.currentCompany);

      data.append("currentCTC", formData.currentCTC);

      data.append("expectedCTC", formData.expectedCTC);

      data.append("noticePeriod", formData.noticePeriod);

      data.append("coverLetter", formData.coverLetter);

      data.append("resume", resume);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/job-application`,
        {
          method: "POST",
          body: data,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit");
      }

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        currentLocation: "",
        experience: "",
        currentCompany: "",
        currentCTC: "",
        expectedCTC: "",
        noticePeriod: "",
        coverLetter: "",
      });

      setResume(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      {/* FORM */}
      <section className="pt-24 pb-16 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div
            className="rounded-[40px] border bg-[var(--card)] p-8 md:p-12"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div className="text-center mb-12">
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Application Form
              </span>

              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                Join Our Team
              </h2>

              <p className="mt-5 text-[var(--text-secondary)] max-w-2xl mx-auto leading-8">
                Fill in your details and upload your latest resume. Our HR team
                will review your profile and contact you if a suitable
                opportunity is available.
              </p>
            </div>

            {careerId ? (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 rounded-full border border-green-200 text-[var(--text-primary)] text-sm font-medium">
                  Position Apply for{" "}
                  <span className="text-[var(--primary)]">{careerTitle}</span>
                </span>
              </div>
            ) : (
              <div className="mb-8 inline-flex px-5 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                General Resume Submission
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-3xl border border-[var(--border)] p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Personal Information
                  </h3>

                  <p className="text-[var(--text-secondary)] mt-2">
                    Basic details required for communication.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                      className="career-input"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email"
                      className="career-input"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Mobile Number *
                    </label>

                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter mobile number"
                      className="career-input"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block mb-2 text-sm font-medium">
                      Current Location
                    </label>

                    <input
                      type="text"
                      value={formData.currentLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentLocation: e.target.value,
                        })
                      }
                      placeholder="City, State"
                      className="career-input"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold">
                    Professional Information
                  </h3>

                  <p className="text-[var(--text-secondary)] mt-2">
                    Help us understand your experience.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentCompany: e.target.value,
                      })
                    }
                    placeholder="Current Company"
                    className="career-input"
                  />

                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experience: e.target.value,
                      })
                    }
                    placeholder="Experience (e.g. 3 Years)"
                    className="career-input"
                  />

                  <input
                    type="text"
                    value={formData.currentCTC}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentCTC: e.target.value,
                      })
                    }
                    placeholder="Current CTC"
                    className="career-input"
                  />

                  <input
                    type="text"
                    value={formData.expectedCTC}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedCTC: e.target.value,
                      })
                    }
                    placeholder="Expected CTC"
                    className="career-input"
                  />
                </div>

                <div className="mt-6">
                  <input
                    type="text"
                    value={formData.noticePeriod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        noticePeriod: e.target.value,
                      })
                    }
                    placeholder="Notice Period"
                    className="career-input"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-6">Resume Upload</h3>

                <div className="border-2 border-dashed border-[var(--primary)]/30 rounded-3xl bg-[var(--primary)]/5 p-10 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size must be less than 5MB");
                        return;
                      }

                      setResume(file);
                    }}
                    className="hidden"
                    id="resume"
                  />

                  <label htmlFor="resume" className="cursor-pointer block">
                    <div className="text-6xl mb-4">📄</div>

                    <h4 className="text-xl font-semibold">Upload Resume</h4>

                    <p className="mt-2 text-[var(--text-secondary)]">
                      PDF (Max 5MB)
                    </p>

                    {resume ? (
                      <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700">
                        ✓ {resume.name}
                      </div>
                    ) : (
                      <div className="mt-6 inline-flex px-6 py-3 rounded-xl bg-[var(--primary)] text-white">
                        Choose File
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] p-6 md:p-8">
                <h3 className="text-2xl font-semibold mb-6">
                  Additional Information
                </h3>

                <textarea
                  rows={8}
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverLetter: e.target.value,
                    })
                  }
                  placeholder="Tell us about yourself, achievements, projects, certifications etc."
                  className="career-textarea"
                />
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="
      min-w-[280px]
      h-14
      rounded-2xl
      bg-[var(--primary)]
      text-white
      font-semibold
      flex
      items-center
      justify-center
      gap-3
      hover:scale-[1.02]
      transition-all
      disabled:opacity-60
    "
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          opacity="0.25"
                        />
                      </svg>
                      Submitting Application...
                    </>
                  ) : (
                    <>Submit Application →</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
