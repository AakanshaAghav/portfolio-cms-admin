"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col p-6
      bg-gradient-to-b from-[#fafaff] to-white
      border-r border-gray-100 shadow-sm"
    >
      {/* Logo */}
      <h2 className="text-2xl font-black mb-10 tracking-tight text-gray-900">
        Admin <span className="text-indigo-600">CMS</span>
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <SidebarLink href="/dashboard" label="Dashboard" />
        <SidebarLink href="/dashboard/skills" label="Skills" />
        <SidebarLink href="/dashboard/experience" label="Experience" />
        <SidebarLink href="/dashboard/projects" label="Projects" />
        <SidebarLink href="/dashboard/blogs" label="Blogs" />
        <SidebarLink href="/dashboard/testimonials" label="Testimonials" />
        <SidebarLink href="/dashboard/services" label="Services" />
        <SidebarLink href="/dashboard/about" label="About" />
        <SidebarLink href="/dashboard/contact" label="Contact" />
      </nav>

      {/* Push logout to bottom */}
      <div className="mt-auto pt-6">
        <button
          onClick={logout}
          className="w-full py-2.5 rounded-xl font-bold
            bg-gradient-to-r from-red-500 to-pink-500
            text-white shadow-md
            hover:shadow-lg hover:scale-[1.02]
            transition-all"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

/* Reusable Sidebar Link */
function SidebarLink({ href, label }) {
  return (
    <Link
      href={href}
      className="
        px-4 py-2.5 rounded-xl text-sm font-semibold
        text-gray-600
        hover:text-indigo-600
        hover:bg-indigo-50
        transition-all
        flex items-center gap-3
      "
    >
      <span className="w-2 h-2 rounded-full bg-indigo-400 opacity-40"></span>
      {label}
    </Link>
  );
}
