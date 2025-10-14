"use client";
import Logo from "@/components/ui/logo";
import RegistrationForm from "@/components/ui/auth/reg-form";

export default function RegisterPage() {
    return (
        <main className="flex h-screen">
            <div className="flex-1 flex flex-col justify-between p-10 font-extralight italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                <Logo />
                <div className="text-7xl">
                    Welcome. <br />
                    Begin your cinematic adventure now with our
                    ticketing platform.
                </div>
            </div>

            <div className="flex-1 bg-white flex flex-col justify-center items-center">
                <RegistrationForm />
            </div>
        </main>
    );
}
