// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import XdetexLogo from "/images/xdetex-logo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_BASE_URL}/user/login?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("user", JSON.stringify({ email: data.email }));
        window.location.href = "/user/welcome";
      } else {
        setErrorMessage(data.message || "Invalid email. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(
        "Unable to connect to the server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-20">
      <img
        src={XdetexLogo}
        alt="XDetex Logo"
        className="w-1/4 sm:w-1/6 md:w-1/8 max-w-full mx-auto mb-4 sm:mb-6 md:mb-15"
      />

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-1 border-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign in</h2>

        <label className="block text-gray-600 text-sm mb-2">Email</label>

        {/* Email input with inline loader */}
        <div className="relative mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {loading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-5 h-5 border-2 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {errorMessage}
          </p>
        )}

        <p className="text-gray-500 text-sm mb-6 text-center">
          This email was already used in the previous questionnaire. Please log
          in.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-full font-medium transition ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-primary-blue text-white hover:bg-white hover:text-primary-blue hover:border-2"
          }`}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-gray-500 text-sm mt-4 text-center">
          By continuing, you agree to the Terms of Use and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
