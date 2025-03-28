"use client";
import Link from "next/link";
import { FacebookIcon, GoolgeIcon } from "../ui/icons";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogInForm = () => {
	const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await signIn(email, password);
			router.push("/dashboard");
		} catch (err) {
			setError(err.message);
		}
	};
	const handleGoogleLogin = async () => {
		try {
			await signInWithGoogle();
			router.push("/dashboard");
		} catch (err) {
			setError("Something went wrong ! Check your credintials");
		}
	};
	return (
		<div className="font-poppins bg-foreground p-16 w-[600px] rounded-xl absolute right-56 -top-36 h-[90vh] mb-56">
			<h4 className="text-xl">WELCOME BACK!</h4>
			<h2 className="text-3xl">Log In to your Account</h2>
			<span className="text-primary">{error && error}</span>
			<div className="flex flex-col  items-start my-4 gap-y-4">
				<label htmlFor="email" className="text-lg">
					Email
				</label>
				<input
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					name="email"
					id=""
					className="border-2 border-[#E0E0E0] border-solid w-full p-2 rounded-md"
					placeholder="Type here...."
				/>
				<label htmlFor="password" className="text-lg">
					Password
				</label>
				<input
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					name="password"
					id=""
					className="border-2 border-[#E0E0E0] border-solid w-full p-2 rounded-md"
					placeholder="Type here...."
				/>
				<div className="flex items-center w-full justify-between">
					<div>
						<input
							type="checkbox"
							name="remember-me"
							className="mr-2 checked:bg-primary w-4 h-4"
							id=""
						/>
						<label htmlFor="remember-me" className="text-md">
							Remember me
						</label>
					</div>
					<Link href={"/"}>Forgot Password?</Link>
				</div>
				<button
					onClick={handleLogin}
					type="submit"
					className="bg-primary text-foreground w-full p-2 rounded-md hover:bg-foreground hover:text-background border-2 border-primary border-solid cursor-pointer"
				>
					Log in
				</button>
			</div>
			<div className="flex justify-evenly items-center text-center my-4 ">
				<hr className="text-gray-400 w-[40%]" />
				Or
				<hr className="text-gray-400 w-[40%]" />
			</div>
			<div className="text-md flex flex-col gap-y-4">
				<button
					className="flex items-center justify-center border-2 border-[#E0E0E0] border-solid w-full p-2 gap-x-8 rounded-md"
					onClick={handleGoogleLogin}
				>
					<GoolgeIcon />
					Log in with google
				</button>
				<button
					className="flex items-center justify-center border-2 border-[#E0E0E0] border-solid w-full p-2 gap-x-8 rounded-md"
					onClick={handleGoogleLogin}
				>
					<FacebookIcon />
					Log in with Faccebook
				</button>
				<Link
					className="text-sm underline font-bold text-center w-full my-8"
					href={"/signup"}
				>
					New User? SIGN UP HERE
				</Link>
			</div>
		</div>
	);
};

export default LogInForm;
