"use client";
import Button from "@/app/components/ui/button";
import EmailInput from "@/app/components/ui/inputs/email-input";
import PasswordInput from "@/app/components/ui/inputs/password-input";
import type { FormEventHandler } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/app/components/google-icon";
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
            router.push("/profile");
        } else {
            postMessage("Server Error");
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
                <GoogleIcon />
                <span>Continue with Google</span>
            </Button>
        </form>
    );
}
