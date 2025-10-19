// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import XdetexLogo from "/images/xdetex-logo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleLogin = () => {
    // Redirect to the submit page (assuming a route like /welcome-back)
    // If using React Router, use navigate('/welcome-back');
    // For simplicity, using window.location
    window.location.href = "/user/welcome";
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
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-500 text-sm mb-6 text-center">
          This email was already used in the previous questionnaire. Please log
          in.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-primary-blue text-white py-3 rounded-full font-medium hover:bg-white hover:text-primary-blue hover:border-2 transition"
        >
          Log in
        </button>
        <p className="text-gray-500 text-sm mt-4 text-center">
          By continuing, you agree to the Terms of Use and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
