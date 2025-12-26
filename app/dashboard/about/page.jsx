"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [currentAbout, setCurrentAbout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  /* ---------------- FETCH ABOUT ---------------- */
  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/about`);
      const data = await res.json();

      setCurrentAbout(data);
      setContent(data?.content || "");
      setImageUrl(data?.image_url || "");
      setResumeUrl(data?.resume_url || "");
    } catch (err) {
      console.error("Error fetching about:", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  /* ---------------- UPDATE ABOUT ---------------- */
  const handleUpdate = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // ✅ FormData is created HERE
      const formData = new FormData();
      formData.append("content", content);
      formData.append("resume_url", resumeUrl);

      if (imageFile) {
        formData.append("image", imageFile); // 👈 laptop file
      }

      // ✅ FormData is sent HERE
      const res = await fetch(`${API_BASE}/api/about`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ❗ no Content-Type
        },
        body: formData, // 👈 THIS is where it goes
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setCurrentAbout(updated);
      setIsEditing(false);
      alert("About updated successfully ✅");
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
          <h1 className="text-3xl font-extrabold text-gray-900">About Me</h1>
          <p className="text-gray-500 mt-1">
            Manage your portfolio biography and assets.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition shadow"
          >
            Edit About
          </button>
        )}
      </header>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          {currentAbout?.image_url && (
            <img
              src={currentAbout.image_url}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-2xl shadow"
            />
          )}

          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {currentAbout?.content || "No content added yet."}
          </p>

          {currentAbout?.resume_url && (
            <a
              href={currentAbout.resume_url}
              target="_blank"
              className="inline-block text-blue-600 font-semibold underline"
            >
              View Resume
            </a>
          )}

          <div className="text-xs text-gray-400 pt-4 border-t">
            Last updated:{" "}
            {currentAbout?.updated_at
              ? new Date(currentAbout.updated_at).toLocaleString()
              : "Never"}
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-6">
          {/* BIO */}
          <div>
            <label className="block text-sm font-bold mb-2">Bio</label>
            <textarea
              className="w-full h-48 border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your professional bio..."
            />
          </div>

          {/* IMAGE URL */}
          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Profile Image
            </label>

            <input
              type="file"
              className="w-full border p-3 rounded-lg bg-gray-50"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            {/* Preview selected file */}
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="mt-4 w-32 h-32 rounded-xl object-cover border"
              />
            )}

            {/* Show existing image if no new file selected */}
            {!imageFile && imageUrl && (
              <img
                src={imageUrl}
                alt="Current"
                className="mt-4 w-32 h-32 rounded-xl object-cover border"
              />
            )}
          </div>

          {/* RESUME URL */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Resume URL (Supabase)
            </label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://supabase.co/resume.pdf"
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
                setContent(currentAbout?.content || "");
                setImageUrl(currentAbout?.image_url || "");
                setResumeUrl(currentAbout?.resume_url || "");
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
