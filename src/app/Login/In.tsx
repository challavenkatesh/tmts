"use client";
import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const token = data.access_token;
      console.log("JWT Token:", token);

      // Decode token
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded); // check roles here

      // Save token if needed (optional)
      localStorage.setItem("token", token);

      // Redirect based on role
      if (decoded.role === "admin") {
        router.push("/admin-dashboard");
      } else if (decoded.role === "trainer") {
        router.push("/trainer-dashboard");
      } else if (decoded.role === "employee") {
        router.push("/employee-dashboard");
      } else {
        alert("Unknown role");
      }
    } else {
      alert(data.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="flex bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img
            src="https://i.pinimg.com/originals/9f/c2/12/9fc2126eec2c0a3876e3f2097af9b983.gif"
            alt="Login Visual"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Welcome Back!
          </h2>
          <p className="mb-8 text-gray-600">
            Login to your account to continue
          </p>
          {error && (
            <div className="mb-4 text-red-600 font-semibold">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out hover:scale-105"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-300 ease-in-out hover:scale-105"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-sm text-pink-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-pink-700 hover:scale-105 transform transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
