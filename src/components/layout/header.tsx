import Link from "next/link";
import Logo from "@/components/ui/logo";
import Button from "@/components/ui/button";

export default function Header() {
    return (
        <header className="flex items-center justify-between container mx-auto py-6">
            <div className="flex gap-48">
                <Logo />
                <div className="flex gap-8 text-lg">
                    <Button variant="ghost" size="none" href="/movies">
                        Now Showing
                    </Button>
                    <Button variant="ghost" size="none" href="/">
                        About us
                    </Button>
                    <Button variant="ghost" size="none" href="/">
                        Upcomig
                    </Button>
                </div>
            </div>
            <div className="flex gap-6">
                <Button variant="primary" size="sm" href="/login">
                    Login
                </Button>
                <Button variant="outline" size="sm" href="/registration">
                    Register
                </Button>
            </div>
        </header>
    );
}
