"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const submittedEmail = (
      formData.get("email")?.toString().trim() || email.trim()
    ).toLowerCase();
    const submittedPassword = formData.get("password")?.toString() || password;

    if (!submittedEmail || !submittedPassword) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const isValidDemoLogin =
        submittedEmail === "admin@example.com" && submittedPassword === "password";

      if (!isValidDemoLogin) {
        setError("Invalid credentials.");
        return;
      }

      localStorage.setItem("admin_demo_auth", "true");

      const redirectTarget = searchParams.get("redirect");
      const safeRedirect =
        redirectTarget && redirectTarget.startsWith("/admin")
          ? redirectTarget
          : "/admin/dashboard";

      router.push(safeRedirect);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img
              src="/logo.png"
              alt="Dumpster Duff's"
              className="w-12 h-12 mx-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-[#999999]">
            Secure access to your operations dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8 bg-[#1A1A1A]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dumpsterduffs.com"
                className="input-field w-full"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
                required
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full font-semibold text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

        </div>

        {/* Demo credentials (remove in production) */}
        <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400 font-mono">
            Demo: admin@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
}
