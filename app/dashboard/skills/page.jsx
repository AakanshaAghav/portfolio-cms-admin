"use client";

import { useEffect, useState } from "react";
import CmsTable from "../../components/CmsTable"; // Adjust the path based on your folder structure
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLevel, setEditLevel] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- API ACTIONS ---------------- */

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch skills");
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async () => {
    if (!name.trim()) return alert("Skill name required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, level }),
      });
      const newSkill = await res.json();
      setSkills((prev) => [...prev, newSkill]);
      setName("");
      setLevel("Beginner");
    } catch (err) {
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await fetch(`${API_BASE}/api/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error("Failed to delete skill");
    }
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, level: editLevel }),
      });
      const updated = await res.json();
      setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id);
    setEditName(skill.name);
    setEditLevel(skill.level);
  };

  /* ---------------- TABLE CONFIG ---------------- */

  const columns = [
    { label: "Skill Name", key: "name" },
    {
      label: "Proficiency",
      key: "level",
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            row.level === "Advanced"
              ? "bg-purple-100 text-purple-700"
              : row.level === "Intermediate"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.level}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Skills Management
        </h1>
        <p className="text-gray-500 mt-1">
          Add or update your technical expertise.
        </p>
      </header>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-10 flex flex-wrap gap-6 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Skill Name
          </label>
          <input
            type="text"
            placeholder="React, Node.js..."
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all w-72"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">
            Level
          </label>
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white cursor-pointer min-w-[160px]"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <button
          onClick={addSkill}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md active:scale-95"
        >
          {loading ? "Adding..." : "Add Skill"}
        </button>
      </div>

      {/* REUSABLE TABLE */}
      <CmsTable
        columns={columns}
        data={skills}
        editingId={editingId}
        renderActions={(skill) => (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => startEdit(skill)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => deleteSkill(skill.id)}
              className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        )}
        renderEditRow={(skill) => (
          <>
            <td className="px-6 py-4">
              <input
                className="border border-blue-500 px-3 py-1.5 rounded-md w-full outline-none ring-2 ring-blue-50"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
            </td>
            <td className="px-6 py-4">
              <select
                className="border border-blue-500 px-3 py-1.5 rounded-md w-full outline-none ring-2 ring-blue-50 bg-white"
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => saveEdit(skill.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </td>
          </>
        )}
      />
    </div>
  );
}
