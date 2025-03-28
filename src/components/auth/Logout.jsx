"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Logout() {
	const { logOut } = useAuth();
	const router = useRouter();

	const handleLogout = async () => {
		await logOut();
		router.push("/");
	};

	return <button onClick={handleLogout}>Logout</button>;
}
