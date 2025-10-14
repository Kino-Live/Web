import EmailInput from "../inputs/email-input";
import PasswordInput from "../inputs/password-input";
import Button from "@/components/ui/button";

export default function RegistrationForm() {
    return (
        <form className="flex flex-col space-y-7">
            <h1 className="text-black font-semibold text-3xl">Create an account</h1>
            <EmailInput />
            <PasswordInput withConfirm />
            <Button variant="primary" size="lg">
                Create Account
            </Button>
        </form>
    );
}
