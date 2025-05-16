"use client";
import React, { useState } from "react";

const LoginCard = () => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in with\nUsername: ${form.username}\nPassword: ${form.password}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center px-6 py-12">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10
          transform transition-transform duration-700 ease-in-out animate-fadeInUp"
      >
        {/* Top Image */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-8">
          <img
            src="https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif"
            alt="Welcome animation"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Welcome Text */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Welcome Back! Please Login
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Username"
              className="peer w-full border-b-2 border-gray-300 placeholder-transparent
                focus:border-indigo-600 focus:outline-none focus:ring-0 text-gray-900
                transition-transform transform hover:scale-105 py-3"
            />
            <label
              htmlFor="username"
              className="absolute left-0 -top-6 text-gray-600 text-sm
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-6 peer-focus:text-indigo-600 peer-focus:text-sm
                transition-all pointer-events-none"
            >
              Username
            </label>
            {/* Animated underline */}
            <span className="block absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 transition-all peer-focus:w-full"></span>
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="peer w-full border-b-2 border-gray-300 placeholder-transparent
                focus:border-indigo-600 focus:outline-none focus:ring-0 text-gray-900
                transition-transform transform hover:scale-105 py-3"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-6 text-gray-600 text-sm
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                peer-focus:-top-6 peer-focus:text-indigo-600 peer-focus:text-sm
                transition-all pointer-events-none"
            >
              Password
            </label>
            {/* Animated underline */}
            <span className="block absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 transition-all peer-focus:w-full"></span>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-transform transform hover:scale-110"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg
              transition-transform transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
