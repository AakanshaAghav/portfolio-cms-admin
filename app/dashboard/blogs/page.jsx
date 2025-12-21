"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- HELPERS ---------------- */
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const fetchBlogs = async () => {
    const res = await fetch(`${API_BASE}/api/blogs`);
    const data = await res.json();
    setBlogs(data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const handleAdd = async () => {
    if (!formData.title || !formData.content)
      return alert("Title and Content required");
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug || generateSlug(formData.title),
          content: formData.content,
          image_url: formData.imageUrl,
        }),
      });
      fetchBlogs();
      setFormData({ title: "", slug: "", content: "", imageUrl: "" });
    } catch (err) {
      alert("Error adding blog");
    }
    setLoading(false);
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          slug: editData.slug,
          content: editData.content,
          image_url: editData.imageUrl,
        }),
      });
      setEditingId(null);
      fetchBlogs();
    } catch (err) {
      alert("Update failed");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    await fetch(`${API_BASE}/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBlogs();
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    { label: "Blog Title", key: "title" },
    {
      label: "Slug",
      key: "slug",
      render: (row) => (
        <span className="text-gray-400 text-xs">/{row.slug}</span>
      ),
    },
    {
      label: "Date",
      key: "created_at",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Blog Management
        </h1>
        <p className="text-gray-500">Create and manage your articles.</p>
      </header>

      {/* ADD BLOG FORM */}
      <div className="bg-white p-6 rounded-xl border mb-10 space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Title
            </label>
            <input
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Slug (Auto-generated)
            </label>
            <input
              className="border p-2 rounded-lg bg-gray-50 text-gray-500"
              value={formData.slug}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Image URL
          </label>
          <input
            className="border p-2 rounded-lg"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>
        <textarea
          placeholder="Blog Content..."
          className="border p-4 rounded-lg w-full h-40 focus:ring-2 focus:ring-black outline-none"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </div>

      {/* TABLE */}
      <CmsTable
        columns={columns}
        data={blogs}
        editingId={editingId}
        renderActions={(row) => (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setEditingId(row.id);
                setEditData({
                  title: row.title,
                  slug: row.slug,
                  content: row.content,
                  imageUrl: row.image_url,
                });
              }}
              className="text-blue-600 font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-500 font-medium"
            >
              Delete
            </button>
          </div>
        )}
        renderEditRow={(row) => (
          <td colSpan={4} className="p-6 bg-gray-50 border-x">
            <div className="space-y-4 animate-in fade-in duration-300">
              <input
                className="border p-2 rounded w-full font-bold"
                value={editData.title}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
              />
              <input
                className="border p-2 rounded w-full text-xs text-gray-500"
                value={editData.slug}
                readOnly
              />
              <textarea
                className="border p-4 rounded w-full h-60 bg-white"
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(row.id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex-1"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        )}
      />
    </div>
  );
}
