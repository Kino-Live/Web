import Button from "@/components/ui/button";
import EmailInput from "@/components/ui/inputs/email-input";
import PasswordInput from "@/components/ui/inputs/password-input";

export default function LoginForm() {
    return (
        <form className="flex flex-col space-y-7">
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
                    className="text-green-400">
                    Register Here
                </Button>
            </p>
        </form>
    );
}
