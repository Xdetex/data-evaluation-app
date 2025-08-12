import React, { useState } from "react";
import LoginImg from "/images/login-imge.png";
import XdetexLogo from "/images/xdetex-logo.png";
import ValidatedInputField from "../../components/input-field"; // Assuming this is ValidatedInputField.tsx
import * as yup from "yup";
import CustomButton from "../../components/custom-button";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

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
      // Add your login logic here, e.g., API call
      console.log("Form submitted:", { email, password });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { email?: string; password?: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof typeof newErrors] = error.message;
          }
        });
        setErrors(newErrors);
      }
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
        <form className="w-full">
          <ValidatedInputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <ValidatedInputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </form>
        <CustomButton
          className="bg-primary-blue hover:bg-white hover:text-primary-blue text-white hover:border-2 hover:border-primary-blue w-full"
          onPress={handleSubmit} // Fixed from onPress to onClick
        >
          Login
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
