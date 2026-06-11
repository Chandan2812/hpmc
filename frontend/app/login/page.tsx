"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // ADMIN LOGIN

      if (
        email === process.env.NEXT_PUBLIC_ADMIN_USER &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASS
      ) {
        Cookies.set("adminAuth", "true", {
          expires: 1,
          sameSite: "strict",
        });

        router.push("/admin");
        return;
      }

      // EMPLOYEE LOGIN

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid credentials");
        return;
      }

      Cookies.set("employeeAuth", data.token, {
        expires: 1,
        sameSite: "strict",
      });

      Cookies.set("employee", JSON.stringify(data.employee), {
        expires: 1,
        sameSite: "strict",
      });

      router.push("/employee");
    } catch (error) {
      console.error(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  text-[var(--foreground)]">
      <Navbar />

      {/* LOGIN SECTION */}
      <section className="mt-24 relative overflow-hidden pb-10">
        <div className="relative z-10 px-4">
          <div
            className="
              mx-auto
              max-w-5xl
              overflow-hidden
              rounded-3xl
              border border-[var(--border)]
              bg-[var(--card)]
              shadow-[var(--shadow-primary)]
              grid grid-cols-1 md:grid-cols-2
            "
          >
            {/* LEFT SIDE */}
            <div className="hidden md:flex flex-col justify-center p-12 bg-[var(--sidebar-bg)]">
              <span className="mb-4 inline-flex w-fit rounded-full bg-[var(--primary)]/10 px-4 py-2 text-xs font-medium text-[var(--primary)]">
                Secure Access
              </span>

              <h2 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
                Admin Control Panel
              </h2>

              <p className="max-w-md leading-relaxed text-[var(--text-secondary)]">
                Access your administrative dashboard to manage content,
                inquiries, projects, and website settings securely.
              </p>

              <div className="mt-10 space-y-4 text-sm text-[var(--text-secondary)]">
                <div>✓ Secure administrator access</div>
                <div>✓ Centralized management dashboard</div>
                <div>✓ Protected system controls</div>
                <div>✓ Real-time content management</div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-8 md:p-12">
              <div className="mb-10 text-center">
                <div
                  className="
                    mx-auto mb-5
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    bg-[var(--primary)]/10
                  "
                >
                  <Lock size={24} className="text-[var(--primary)]" />
                </div>

                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                  Admin / Employee Login
                </h1>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Sign in to continue
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-[var(--text-secondary)]
                      "
                    />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@company.com"
                      className="
                        w-full rounded-xl
                        border border-[var(--border)]
                        bg-[var(--background)]
                        py-3 pl-11 pr-4
                        text-[var(--text-primary)]
                        placeholder:text-[var(--text-light)]
                        transition-all
                        focus:border-[var(--primary)]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="
                        absolute left-4 top-1/2
                        -translate-y-1/2
                        text-[var(--text-secondary)]
                      "
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="
                        w-full rounded-xl
                        border border-[var(--border)]
                        bg-[var(--background)]
                        py-3 pl-11 pr-12
                        text-[var(--text-primary)]
                        placeholder:text-[var(--text-light)]
                        transition-all
                        focus:border-[var(--primary)]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-[var(--text-secondary)]
                        transition-colors
                        hover:text-[var(--primary)]
                      "
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="
                      rounded-xl
                      border border-red-500/20
                      bg-red-500/10
                      p-3
                      text-center
                      text-sm
                      text-red-500
                    "
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex h-12 w-full items-center justify-center
                    rounded-xl
                    bg-[var(--primary)]
                    font-medium
                    text-white
                    transition-all
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                  "
                >
                  {loading ? "Authenticating..." : "Login to Dashboard"}
                </button>
              </form>

              <p className="mt-10 text-center text-xs text-[var(--text-secondary)]">
                © {new Date().getFullYear()} • Secure Admin Access
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
