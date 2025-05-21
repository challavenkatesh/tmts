"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.email === "admin@example.com" &&
      formData.password === "admin123"
    ) {
      router.push("/AdminPage/admin"); // Redirect to admin page
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200 transition-colors duration-700">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-5xl w-full flex rounded-3xl shadow-2xl overflow-hidden bg-white"
      >
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="relative z-0 w-full group">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full appearance-none bg-transparent border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-600 text-lg px-1 py-3"
              />
              <label
                htmlFor="email"
                className="absolute left-1 top-3 text-gray-500 text-lg duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Email Address
              </label>
            </div>

            {/* Password Field */}
            <div className="relative z-0 w-full group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full appearance-none bg-transparent border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-600 text-lg px-1 py-3 pr-12"
              />
              <label
                htmlFor="password"
                className="absolute left-1 top-3 text-gray-500 text-lg duration-300 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-3 text-indigo-600 font-semibold text-sm px-2 py-1 rounded-md hover:bg-indigo-100 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox text-indigo-600" />
                Remember Me
              </label>
              <a href="#" className="text-indigo-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <a href="#" className="font-medium text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right side - Decorative SVG background */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative"
        >
          {/* Animated SVG Circles */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="300"
              cy="300"
              r="200"
              fill="rgba(255,255,255,0.1)"
              animate={{ r: [180, 220, 180] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.circle
              cx="300"
              cy="300"
              r="140"
              fill="rgba(255,255,255,0.2)"
              animate={{ r: [120, 160, 120] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.circle
              cx="300"
              cy="300"
              r="80"
              fill="rgba(255,255,255,0.3)"
              animate={{ r: [60, 100, 60] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-12 text-center">
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Smart Training Tracker
            </h2>
            <p className="text-lg drop-shadow-md">
              Track your progress, manage training, and enhance performance seamlessly.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
