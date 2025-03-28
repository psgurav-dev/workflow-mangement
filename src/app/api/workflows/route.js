import { connect as connectToDatabase } from "@/config/db";
import { transporter } from "@/config/mailer";
import Workflow from "@/models/Workflow";
import { NextResponse } from "next/server";

export async function GET(req) {
	try {
		await connectToDatabase();

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 5;
		const searchQuery = searchParams.get("search") || "";
		const skip = (page - 1) * limit;
		const query = searchQuery
			? {
					$or: [
						{ workflowName: { $regex: searchQuery, $options: "i" } },
						{ id: parseInt(searchQuery) || 0 },
					],
			  }
			: {};

		const workflows = await Workflow.find(query)
			.sort({ lastEdited: -1 }) // Sorting ensures the latest ones appear first
			.skip(skip)
			.limit(limit);

		const totalWorkflows = await Workflow.countDocuments(query);

		return NextResponse.json({
			workflows,
			totalPages: Math.ceil(totalWorkflows / limit),
			currentPage: page,
		});
	} catch (error) {
		console.error("Error fetching workflows:", error);
		return NextResponse.json(
			{ error: "Error fetching workflows" },
			{ status: 500 }
		);
	}
}


const sendEmail = async (email, workflow) => {
	try {
		const info = await transporter.sendMail({
			from: "dev.psgurav@gmail.com",
			to: email,
			subject: `New Workflow Created: ${workflow.workflowName}`,
			html: `<p>Your workflow <strong>${workflow.workflowName}</strong> has been created successfully.</p>`,
		});
		console.log("Email sent:", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

export async function POST(req) {
	try {
		await connectToDatabase();
		const body = await req.json();
		const lastWorkflow = await Workflow.findOne().sort({ id: -1 });
		const newId = lastWorkflow ? lastWorkflow.id + 1 : 1; 

		const newWorkflow = await Workflow.create({ id: newId, ...body });
		if (body.email) {
			await sendEmail(body.email, newWorkflow);
		}

		return NextResponse.json(newWorkflow, { status: 201 });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ error: "Error creating workflow" },
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	try {
		await connectToDatabase();

		const body = await req.json();
		const { id, ...updatedFields } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "Workflow ID is required for updating" },
				{ status: 400 }
			);
		}

		const updatedWorkflow = await Workflow.findOneAndUpdate(
			{ id },
			{ ...updatedFields, lastEdited: new Date() },
			{ new: true }
		);

		if (!updatedWorkflow) {
			return NextResponse.json(
				{ error: "Workflow not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedWorkflow);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Error updating workflow" },
			{ status: 500 }
		);
	}
}
