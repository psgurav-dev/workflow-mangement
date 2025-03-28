import { connect as connectToDatabase } from "@/config/db";
import Workflow from "@/models/Workflow";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();

    const workflow = await Workflow.findOne({ id });
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    workflow.executions.push({ status });
    workflow.lastUpdated = new Date();
    await workflow.save();

    return NextResponse.json(workflow, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error executing workflow" }, { status: 500 });
  }
}
