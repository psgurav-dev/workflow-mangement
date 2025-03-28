"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/login"); // Redirect if not authenticated
		}
	}, [user, loading, router]);

	if (loading) return <p>Loading...</p>; // Show loading state while checking auth

	return user ? children : null;
}
