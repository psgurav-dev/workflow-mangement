"use client";
import WorkflowTable from "@/components/dashboard/Table";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login"); // Redirect if not authenticated
		}
	}, [user, loading, router]);
	return (
		<div>
			<WorkflowTable />
		</div>
	);
};

export default Page;
