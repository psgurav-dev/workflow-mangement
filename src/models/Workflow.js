import mongoose from "mongoose";

const ExecutionSchema = new mongoose.Schema({
	timestamp: { type: Date, default: Date.now },
	status: { type: String, enum: ["Passed", "Failed"], required: true },
  });

const workflowSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Sequential ID
  workflowName: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastEdited: { type: String, default: new Date().toLocaleString() },
  executions: [ExecutionSchema], 
});

export default mongoose.models.Workflow || mongoose.model("Workflow", workflowSchema);
