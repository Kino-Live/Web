"use client";

import Button from "@/components/ui/button";
import EmailInput from "@/components/ui/inputs/email-input";
import PasswordInput from "@/components/ui/inputs/password-input";
import type { FormEventHandler } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (res && !res.error) {
            const session = await getSession();
            console.log(session);
            router.push("/profile");
        } else {
            console.log("Неверный email или пароль");
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
            <h1 className="text-black font-semibold text-3xl">
                Login to your account
            </h1>
            <EmailInput />
            <PasswordInput />
            <Button variant="primary" size="lg">
                Login
            </Button>
            <p className="text-gray-500 flex justify-center items-center">
                Already have an account?
                <Button
                    variant="ghost"
                    size="none"
                    href="/registration"
                    className="text-green-400"
                    type="submit">
                    Register Here
                </Button>
            </p>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-400"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="none"
                className="border border-neutral-400 text-gray-700 flex items-center justify-center space-x-2"
                onClick={() => signIn("google", { callbackUrl: "/profile" })}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 488 512"
                    className="w-6 h-6">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
                <span>Continue with Google</span>
            </Button>
        </form>
    );
}
