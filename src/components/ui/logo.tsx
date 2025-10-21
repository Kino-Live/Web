import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/">
            <Image src="/Logo.svg" alt="Logo" width={115} height={101} />
        </Link>
    );
}
