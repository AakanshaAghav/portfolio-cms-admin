"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [currentContact, setCurrentContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- FETCH CONTACT ---------------- */
  const fetchContact = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/contact`);
      const data = await res.json();

      setCurrentContact(data);
      setEmail(data?.email || "");
      setLinkedinUrl(data?.linkedin_url || "");
      setGithubUrl(data?.github_url || "");
    } catch (err) {
      console.error("Error fetching contact:", err);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  /* ---------------- UPDATE CONTACT ---------------- */
  const handleUpdate = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST", // upsert
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update contact details");
      }

      const updated = await res.json();
      setCurrentContact(updated);
      setIsEditing(false);
      alert("Contact updated successfully ✅");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* HEADER */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Contact</h1>
          <p className="text-gray-500 mt-1">
            Manage your public contact information.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition shadow"
          >
            Edit Contact
          </button>
        )}
      </header>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-lg font-semibold text-gray-800">
              {currentContact?.email || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
            {currentContact?.linkedin_url ? (
              <a
                href={currentContact.linkedin_url}
                target="_blank"
                className="text-blue-600 font-semibold underline"
              >
                {currentContact.linkedin_url}
              </a>
            ) : (
              <p className="text-gray-400">Not added</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">GitHub</p>
            {currentContact?.github_url ? (
              <a
                href={currentContact.github_url}
                target="_blank"
                className="text-blue-600 font-semibold underline"
              >
                {currentContact.github_url}
              </a>
            ) : (
              <p className="text-gray-400">Not added</p>
            )}
          </div>

          <div className="text-xs text-gray-400 pt-4 border-t">
            Last updated:{" "}
            {currentContact?.updated_at
              ? new Date(currentContact.updated_at).toLocaleString()
              : "Never"}
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-6">
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="youremail@gmail.com"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <label className="block text-sm font-bold mb-2">LinkedIn URL</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>

          {/* GITHUB */}
          <div>
            <label className="block text-sm font-bold mb-2">GitHub URL</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex-1 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEmail(currentContact?.email || "");
                setLinkedinUrl(currentContact?.linkedin_url || "");
                setGithubUrl(currentContact?.github_url || "");
              }}
              className="bg-gray-100 px-6 py-3 rounded-xl font-bold flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
