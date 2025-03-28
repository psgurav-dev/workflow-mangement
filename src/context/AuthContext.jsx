"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signUp = async (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signIn = async (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};

	const logOut = async () => {
		return signOut(auth);
	};

	// Google Login
	const signInWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	};

	// Facebook Login
	const signInWithFacebook = async () => {
		const provider = new FacebookAuthProvider();
		return signInWithPopup(auth, provider);
	};
	return (
		<AuthContext.Provider
			value={{ user, loading, signUp, signIn, logOut, signInWithGoogle }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
