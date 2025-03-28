"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/ui/icons";
import LogInForm from "@/components/auth/LoginForm";

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-[url('/assets/imgs/bg-img.png')] w-full bg-center bg-cover h-screen bg-no-repeat flex items-center justify-center overflow-y-hidden">
      <div
        className="absolute  w-full bg-center bg-cover h-screen bg-no-repeat"
        style={{
          background:
            "linear-gradient(90deg, rgba(33,33,33,0.7259278711484594) 35%, rgba(65,65,65,0.6082808123249299) 73%)",
        }}
      />

      <div className="absolute z-20 flex items-center justify-evenly w-full ">
        <div className="flex flex-col gap-y-24 items-start">
          <Logo />
          <div className="text-foreground w-96 font-zen">
            <h4 className="font-bold text-4xl my-4">Building the Future...</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.{" "}
            </p>
          </div>
        </div>
        <div>
          <LogInForm />
        </div>
      </div>
    </div>
  );
}
