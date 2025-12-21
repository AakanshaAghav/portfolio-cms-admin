"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="p-8 min-h-screen bg-[#fafaff]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          CMS <span className="text-indigo-600">Dashboard</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your portfolio content from one place.
        </p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-lg shadow-md">
            👋
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              Welcome back!
            </h2>
            <p className="text-gray-500 text-sm">
              {"You're"} logged in as an administrator
            </p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed">
          Use the sidebar to manage your{" "}
          <span className="font-semibold text-gray-800">About</span>,
          <span className="font-semibold text-gray-800"> Skills</span>,
          <span className="font-semibold text-gray-800"> Projects</span>,
          <span className="font-semibold text-gray-800"> Experience</span>,
          <span className="font-semibold text-gray-800"> Services</span> and
          <span className="font-semibold text-gray-800"> Contact</span> sections
          of your portfolio.
        </p>
      </div>
    </div>
  );
}
