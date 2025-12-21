"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    company: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- API ACTIONS ---------------- */

  const fetchExperience = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/experience`);
      const data = await res.json();
      setExperiences(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleAdd = async () => {
    if (!formData.title || !formData.company)
      return alert("Title and Company required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          title: "",
          company: "",
          location: "",
          start_date: "",
          end_date: "",
          description: "",
        });
        fetchExperience();
      }
    } catch (err) {
      alert("Failed to add experience");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/experience/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setEditingId(null);
        fetchExperience();
      }
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await fetch(`${API_BASE}/api/experience/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchExperience();
  };

  /* ---------------- TABLE CONFIG ---------------- */

  const columns = [
    {
      label: "Role & Company",
      key: "title",
      render: (row) => (
        <div>
          <div className="font-bold text-gray-900">{row.title}</div>
          <div className="text-sm text-blue-600 font-medium">{row.company}</div>
          <div className="text-xs text-gray-400">{row.location}</div>
        </div>
      ),
    },
    {
      label: "Duration",
      key: "start_date",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {new Date(row.start_date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })}{" "}
          - {" "}
          {row.end_date
            ? new Date(row.end_date).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })
            : " Present"}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Work Experience
        </h1>
        <p className="text-gray-500">
          Manage your professional career timeline.
        </p>
      </header>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Job Title (e.g. Senior Dev)"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            placeholder="Company"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <input
            placeholder="Location (e.g. Remote)"
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
              Start Date
            </label>
            <input
              type="date"
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
              End Date (Leave blank if Present)
            </label>
            <input
              type="date"
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-black"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
            />
          </div>
        </div>

        <textarea
          placeholder="Description of responsibilities..."
          className="border p-2 rounded-lg w-full h-24 outline-none focus:ring-2 focus:ring-black"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full py-3 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Experience"}
        </button>
      </div>

      {/* TABLE */}
      <CmsTable
        columns={columns}
        data={experiences}
        editingId={editingId}
        renderActions={(row) => (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setEditingId(row.id);
                // Pre-format dates for input[type="date"]
                setEditData({
                  ...row,
                  start_date: row.start_date.split("T")[0],
                  end_date: row.end_date ? row.end_date.split("T")[0] : "",
                });
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
          <td colSpan={3} className="p-6 bg-blue-50/50 border-x">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded bg-white"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
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
                type="date"
                className="border p-2 rounded bg-white"
                value={editData.start_date}
                onChange={(e) =>
                  setEditData({ ...editData, start_date: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2 rounded bg-white"
                value={editData.end_date}
                onChange={(e) =>
                  setEditData({ ...editData, end_date: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded bg-white col-span-2 h-24"
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
