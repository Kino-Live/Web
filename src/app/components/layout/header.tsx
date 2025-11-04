import { auth } from "@/auth";
import ButtonLogOut from "@/app/components/ui/logout-btn";
import Logo from "@/app/components/ui/logo";
import Button from "@/app/components/ui/button";

export default async function Header() {
    const session = await auth();

    return (
        <header className="flex items-center justify-between container mx-auto py-6">
            <div className="flex gap-48 items-center">
                <Logo />
                <nav className="flex gap-8 text-lg">
                    <Button variant="ghost" size="none" href="/movies">
                        Now Showing
                    </Button>
                    <Button variant="ghost" size="none" href="/about">
                        About us
                    </Button>
                    <Button variant="ghost" size="none" href="/upcoming">
                        Upcoming
                    </Button>
                </nav>
            </div>

            {session ? (
                <div className="flex gap-6 items-center">
                    <Button variant="primary" size="sm" href="/profile">
                        Profile
                    </Button>
                    <ButtonLogOut />
                </div>
            ) : (
                <div className="flex gap-6 items-center">
                    <Button variant="primary" size="sm" href="/login">
                        Login
                    </Button>
                    <Button variant="outline" size="sm" href="/registration">
                        Register
                    </Button>
                </div>
            )}
        </header>
    );
}
