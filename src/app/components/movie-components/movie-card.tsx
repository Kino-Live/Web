import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/app/lib/types/movie";

interface MovieCardProps {
    id: number | string;
    title: string;
    poster: string;
}

export default function MovieCard({ id, title, poster }: MovieCardProps) {
    return (
        <Link
            href={`/movies/${id}`}
            className="group transition hover:scale-[1.02]">
            <div>
                <Image
                    src={poster}
                    alt={title}
                    width={300}
                    height={450}
                    className="w-full rounded-xl transition-transform duration-300"
                />
            </div>

            <h2 className="mt-3 text-lg font-semibold group-hover:text-green-400">
                {title}
            </h2>
        </Link>
    );
}
