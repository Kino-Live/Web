import Logo from "@/app/components/ui/logo";
import LoginForm from "@/app/components/ui/auth/login-form";

export default function LoginPage() {
    return (
        <main>
            <div className="absolute top-10 left-10">
                <Logo />
            </div>

            <div className="flex min-h-screen items-center justify-center">
                <div className="max-w-xl rounded-2xl bg-white px-8 py-10">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
