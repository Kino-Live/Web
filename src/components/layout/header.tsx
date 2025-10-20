import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full text-white p-4 flex justify-between absolute top-0 left-0">
            <Link href="/" className="text-2xl font-bold">
                KinoLive
            </Link>
            <Link href="/movies" className="text-2xl font-bold">
                Movies
            </Link>
            <Link href="/login" className="text-2xl font-bold">
                Login
            </Link>
            <Link href="/registration" className="text-2xl font-bold">
                Registration
            </Link>
        </header>
    );
}
