"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- API ACTIONS ---------------- */

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async () => {
    if (!formData.title || !formData.description)
      return alert("Title and Description required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: "", description: "", icon: "" });
        fetchServices();
      }
    } catch (err) {
      alert("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditingId(null);
        fetchServices();
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`${API_BASE}/api/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchServices();
  };

  /* ---------------- TABLE CONFIG ---------------- */

  const columns = [
    {
      label: "Service",
      key: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shadow-sm border">
            {/* If using icon names, render string; if using emoji, it works directly */}
            {row.icon || "🛠️"}
          </div>
          <div>
            <div className="font-bold text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-400">
              Created: {new Date(row.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Description",
      key: "description",
      render: (row) => (
        <p className="text-gray-500 text-sm line-clamp-1 max-w-sm">
          {row.description}
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Services</h1>
        <p className="text-gray-500">
          Manage the solutions and expertise you offer to clients.
        </p>
      </header>

      {/* ADD SERVICE FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Service Title
            </label>
            <input
              placeholder="e.g. Web Development"
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Icon (Emoji or Icon Name)
            </label>
            <input
              placeholder="e.g. 💻 or monitor"
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Description
          </label>
          <textarea
            placeholder="Explain what you provide in this service..."
            className="border p-2 rounded-lg w-full h-24 outline-none focus:ring-2 focus:ring-black"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Add Service"}
        </button>
      </div>

      {/* REUSABLE TABLE */}
      <CmsTable
        columns={columns}
        data={services}
        editingId={editingId}
        renderActions={(row) => (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setEditingId(row.id);
                setEditData(row);
              }}
              className="text-blue-600 hover:underline font-medium text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-500 hover:underline font-medium text-sm"
            >
              Delete
            </button>
          </div>
        )}
        renderEditRow={(row) => (
          <td colSpan={3} className="p-6 bg-gray-50 border-x">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded bg-white"
                placeholder="Title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                placeholder="Icon"
                value={editData.icon}
                onChange={(e) =>
                  setEditData({ ...editData, icon: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded bg-white col-span-2 h-24"
                placeholder="Description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
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
