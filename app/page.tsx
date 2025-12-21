"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "./lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      {/* Floating bubbles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-16 w-56 h-56 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-300"></div>
      <div className="absolute bottom-16 left-1/4 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute bottom-10 right-1/3 w-32 h-32 bg-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 mx-4 transition-transform duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Please enter your admin credentials
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-indigo-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white/70 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-indigo-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-300/40 transition-all active:scale-[0.97]"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} Your Company Admin Portal
        </p>
      </div>
    </div>
  );
}
