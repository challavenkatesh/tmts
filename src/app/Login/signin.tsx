// pages/login.js
"use client";
import { useState } from "react";

export default function Login() {
  const [step, setStep] = useState("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step === "username" && username.trim() !== "") {
        setStep("password");
      } else if (step === "password" && password.trim() !== "") {
        alert(`Logging in as ${username}`);
        // Add login logic here
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: info + form */}
      <div className="flex flex-col justify-center items-start bg-white px-10 py-16 md:w-1/2 md:px-20">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 drop-shadow-md">
          Welcome Back!
        </h1>
        <p className="text-gray-600 mb-12 max-w-md">
          Please login to your account to access all features and stay connected.
        </p>

        <div className="w-full max-w-md">
          {step === "username" && (
            <div className="space-y-4">
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Enter your username"
                className="w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition transform hover:scale-105"
              />
              <p className="text-sm text-gray-500">Press Enter to continue</p>
            </div>
          )}

          {step === "password" && (
            <div className="space-y-4">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Enter your password"
                className="w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition transform hover:scale-105"
              />
              <button
                onClick={() => alert(`Logging in as ${username}`)}
                className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition transform hover:scale-105"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setStep("username");
                  setPassword("");
                }}
                className="mt-2 text-indigo-600 underline hover:text-indigo-800"
              >
                Back to Username
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side: large image */}
      <div className="hidden md:flex md:flex-1 relative bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-600">
        <img
          src="https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif"
          alt="Animated Login"
          className="object-cover h-full w-full opacity-90"
        />
      </div>
    </div>
  );
}
