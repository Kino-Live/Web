import { useState } from "react";
import EmailInput from "../inputs/email-input";
import PasswordInput from "../inputs/password-input";
import Button from "@/components/ui/button";

export default function RegistrationForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (data["password"] !== data["confirm-password"]) {
            setMessage("❌ Пароли не совпадают");
            setLoading(false);
            return;
        }

        delete data["confirm-password"];

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setMessage(result.message || "Произошла ошибка");
            } else {
                setMessage("✅ Регистрация успешна!");
                e.currentTarget.reset();
            }
        } catch {
            setMessage("Ошибка сервера");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
            <h1 className="text-black font-semibold text-3xl">
                Create an account
            </h1>
            <EmailInput />
            <PasswordInput withConfirm />
            {message && (
                <p
                    className={`mt-4 text-center text-sm ${
                        message.includes("✅")
                            ? "text-green-400"
                            : "text-red-400"
                    }`}>
                    {message}
                </p>
            )}
            <Button variant="primary" size="lg" type="submit">
                Create Account
            </Button>
            <p className="text-gray-500 flex justify-center items-center">
                Already have an account?
                <Button
                    variant="ghost"
                    size="none"
                    href="/login"
                    className="text-green-400">
                    Log in
                </Button>
            </p>
        </form>
    );
}
