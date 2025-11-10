// src/pages/common/login.tsx
import { useState } from "react";
import LoginImg from "../../../public/images/login-img.jpeg";
import XdetexLogo from "../../../public/images/xdetex-logo.jpeg";
import ValidatedInputField from "../../components/input-field";
import * as yup from "yup";
import CustomButton from "../../components/custom-button";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async () => {
    const schema = yup.object().shape({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    });

    try {
      await schema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      setErrorMessage("");
      setLoading(true);

      // Call backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save user info in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.role === "expert") {
          navigate("/expert/dashboard");
        } else {
          setErrorMessage("Unauthorized role.");
        }
      } else {
        setErrorMessage(data.detail || "Invalid credentials.");
      }
    } catch (err: unknown) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        console.error("Unexpected error:", err.message);
        setErrorMessage("Something went wrong. Please try again.");
      } else {
        console.error("Unknown error:", err);
        setErrorMessage("Unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-row w-full min-h-screen px-4 md:px-20 py-10 bg-white justify-center items-center">
      <div className="flex justify-center items-center gap-6 md:gap-10 flex-col w-full md:w-[40%] p-4 md:p-10">
        <div>
          <img
            src={XdetexLogo}
            alt="XDetex Logo"
            className="w-1/2 md:w-3/4 max-w-full mx-auto"
          />
        </div>
        <div className="font-Poppins text-xl md:text-2xl font-medium">
          Get Started Now
        </div>
        <form
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <ValidatedInputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <div className="flex flex-col justify-center">
            <ValidatedInputField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </form>

        <CustomButton
          className={`w-full flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-blue hover:bg-white hover:text-primary-blue text-white hover:border-2 hover:border-primary-blue"
          }`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </CustomButton>
      </div>

      <div className="hidden md:flex w-[60%] h-full bg-white justify-center items-center">
        <img
          src={LoginImg}
          alt="Login image"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </div>
    </section>
  );
}

export default Login;
