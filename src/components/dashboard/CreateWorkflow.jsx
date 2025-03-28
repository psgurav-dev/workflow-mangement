import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function CreateWorkflowForm({ refreshData, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    workflowName: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      email: user.email,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to create workflow");

      setMessage({ type: "success", text: "Workflow created successfully!" });

      setFormData({ workflowName: "", description: "" });
      refreshData();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-10 pl-0 pt-0 font-poppins rounded-lg w-[600px] bg-foreground"
    >
      <h4 className="font-bold text-2xl mb-10 italic">Save your workflow</h4>

      <div className="flex flex-col gap-4 pb-10">
        <input
          type="text"
          name="workflowName"
          placeholder="Name here"
          value={formData.workflowName}
          onChange={handleChange}
          className="border-2 border-[#E0E0E0] border-solid w-96 p-2 rounded-md"
          required
        />
        <textarea
          name="description"
          placeholder="Write here..."
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded-lg mt-2 h-48"
          required
        />

        {/* Display Success or Error Message */}
        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          className={`bg-primary text-white px-4 py-2 rounded-lg w-28 absolute right-8 bottom-8 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
