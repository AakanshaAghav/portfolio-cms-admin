"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State (New)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    image_url: "",
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    role: "",
    company: "",
    message: "",
    image_url: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- API ACTIONS ---------------- */

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`);
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async () => {
    if (!formData.name || !formData.message)
      return alert("Name and Message are required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: "",
          role: "",
          company: "",
          message: "",
          image_url: "",
        });
        fetchTestimonials();
      }
    } catch (err) {
      alert("Failed to add testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditingId(null);
        fetchTestimonials();
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`${API_BASE}/api/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTestimonials();
  };

  /* ---------------- TABLE CONFIG ---------------- */

  const columns = [
    {
      label: "User",
      key: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.image_url || "https://ui-avatars.com/api/?name=" + row.name
            }
            className="w-10 h-10 rounded-full object-cover border"
            alt={row.name}
          />
          <div>
            <div className="font-bold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">
              {row.role} at {row.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Message",
      key: "message",
      render: (row) => (
        <p className="text-gray-600 text-sm line-clamp-2 max-w-xs italic">
          "{row.message}"
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Testimonials</h1>
        <p className="text-gray-500">
          Client feedback and social proof management.
        </p>
      </header>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Name"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Role (e.g. CEO)"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <input
            placeholder="Company"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
        </div>
        <input
          placeholder="Avatar Image URL"
          className="border p-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-black"
          value={formData.image_url}
          onChange={(e) =>
            setFormData({ ...formData, image_url: e.target.value })
          }
        />
        <textarea
          placeholder="Testimonial Message"
          className="border p-2 rounded-lg w-full h-24 outline-none focus:ring-2 focus:ring-black"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Testimonial"}
        </button>
      </div>

      {/* TABLE */}
      <CmsTable
        columns={columns}
        data={testimonials}
        editingId={editingId}
        renderActions={(row) => (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setEditingId(row.id);
                setEditData(row);
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-500 hover:underline font-medium"
            >
              Delete
            </button>
          </div>
        )}
        renderEditRow={(row) => (
          <td colSpan={3} className="p-6 bg-gray-50 border-x">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded bg-white"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                value={editData.image_url}
                onChange={(e) =>
                  setEditData({ ...editData, image_url: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded bg-white col-span-2 h-24"
                value={editData.message}
                onChange={(e) =>
                  setEditData({ ...editData, message: e.target.value })
                }
              />
              <div className="col-span-2 flex gap-2">
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
