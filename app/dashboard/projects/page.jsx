"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State (Add)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    image: null,
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    mediaId: "", // Keep track of the current image ID
    newImage: null, // Only filled if user wants to change image
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- FETCH ---------------- */
  const fetchProjects = async () => {
    const res = await fetch(`${API_BASE}/api/projects`);
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const uploadImage = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${API_BASE}/api/upload/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    return data.media.id;
  };

  /* ---------------- ADD ---------------- */
  const handleAdd = async () => {
    setLoading(true);
    try {
      const mediaId = await uploadImage(formData.image);
      await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tech_stack: formData.techStack.split(",").map((s) => s.trim()),
          github_url: formData.githubUrl,
          live_url: formData.liveUrl,
          media_id: mediaId,
        }),
      });
      fetchProjects();
      setFormData({
        title: "",
        description: "",
        techStack: "",
        githubUrl: "",
        liveUrl: "",
        image: null,
      });
    } catch (err) {
      alert("Add failed");
    }
    setLoading(false);
  };

  /* ---------------- SAVE EDIT ---------------- */
  const handleSaveEdit = async (id) => {
    setLoading(true);
    try {
      let finalMediaId = editData.mediaId;

      // Only upload if a new file was selected
      if (editData.newImage) {
        finalMediaId = await uploadImage(editData.newImage);
      }

      const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description,
          tech_stack:
            typeof editData.techStack === "string"
              ? editData.techStack.split(",").map((s) => s.trim())
              : editData.techStack,
          github_url: editData.githubUrl,
          live_url: editData.liveUrl,
          media_id: finalMediaId,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchProjects();
      }
    } catch (err) {
      alert("Update failed");
    }
    setLoading(false);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditData({
      title: p.title,
      description: p.description,
      techStack: p.tech_stack.join(", "),
      githubUrl: p.github_url || "",
      liveUrl: p.live_url || "",
      mediaId: p.media_id, // Store current image ID
      newImage: null, // Reset file input
    });
  };

  /* ---------------- TABLE CONFIG ---------------- */
  const columns = [
    {
      label: "Preview",
      key: "media",
      render: (row) => (
        <a
          href={row.media?.file_url}
          target="_blank"
          className="text-blue-500 underline text-xs break-all"
        >
          {row.media?.file_url ? "View Link" : "No Image"}
        </a>
      ),
    },
    { label: "Title", key: "title" },
    {
      label: "Tech Stack",
      key: "tech_stack",
      render: (row) => row.tech_stack.join(", "),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Projects Admin</h1>

      {/* ADD FORM (SIMPLIFIED FOR HEIGHT) */}
      <div className="bg-white p-6 rounded-xl border mb-10 grid grid-cols-2 gap-4">
        <input
          placeholder="Title"
          className="border p-2 rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          placeholder="Tech Stack (React, Node)"
          className="border p-2 rounded"
          value={formData.techStack}
          onChange={(e) =>
            setFormData({ ...formData, techStack: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded col-span-2"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          placeholder="GitHub URL"
          className="border p-2 rounded"
          value={formData.githubUrl}
          onChange={(e) =>
            setFormData({ ...formData, githubUrl: e.target.value })
          }
        />
        <input
          placeholder="Live URL"
          className="border p-2 rounded"
          value={formData.liveUrl}
          onChange={(e) =>
            setFormData({ ...formData, liveUrl: e.target.value })
          }
        />
        <input
          type="file"
          className="col-span-2"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
        />
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded col-span-2 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Project"}
        </button>
      </div>

      <CmsTable
        columns={columns}
        data={projects}
        editingId={editingId}
        renderActions={(p) => (
          <div className="space-x-4">
            <button onClick={() => startEdit(p)} className="text-blue-600">
              Edit
            </button>
            <button
              onClick={async () => {
                if (confirm("Delete?")) {
                  await fetch(`${API_BASE}/projects/${p.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  fetchProjects();
                }
              }}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        )}
        renderEditRow={(p) => (
          <td colSpan={4} className="p-6 bg-blue-50">
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
                value={editData.techStack}
                onChange={(e) =>
                  setEditData({ ...editData, techStack: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded bg-white col-span-2"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                value={editData.githubUrl}
                onChange={(e) =>
                  setEditData({ ...editData, githubUrl: e.target.value })
                }
              />
              <input
                className="border p-2 rounded bg-white"
                value={editData.liveUrl}
                onChange={(e) =>
                  setEditData({ ...editData, liveUrl: e.target.value })
                }
              />
              <div className="col-span-2 border-t pt-2 mt-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  REPLACE IMAGE (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setEditData({ ...editData, newImage: e.target.files[0] })
                  }
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  onClick={() => handleSaveEdit(p.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
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
