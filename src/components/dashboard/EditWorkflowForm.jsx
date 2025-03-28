import { useState } from "react";

export default function EditWorkflowForm({ workflow, onClose, refreshData }) {
	const [formData, setFormData] = useState({
		workflowName: workflow?.workflowName || "",
		description: workflow?.description || "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/workflows", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: workflow.id, ...formData }),
			});
			const result = await res.json();

			if (!res.ok) throw new Error(result.error);

			refreshData();
			onClose();
		} catch (error) {
			console.error("Error updating workflow:", error);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-lg font-bold mb-4 italic">Edit Workflow</h2>
			<form onSubmit={handleSubmit} className="mb-4 p-10 pl-0 pt-0 font-poppins rounded-lg w-[600px] bg-foreground">
				<label className="block mb-2">Workflow Name:</label>
				<input
					type="text"
					name="workflowName"
					value={formData.workflowName}
					onChange={handleChange}
					className="w-full p-2 border rounded"
				/>

				<label className="block mt-4 mb-2">Description:</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					className="w-full p-2 border rounded-lg h-40"
				/>

				<div className="mt-4 flex justify-end space-x-2">
					<button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg cursor-pointer">
						Update
					</button>
					<button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-pointer">
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
