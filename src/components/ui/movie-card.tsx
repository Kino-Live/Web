import Link from "next/link";

interface MovieCardProps {
    id: number | string;
    title: string;
    poster: string;
}

export default function MovieCard({ id, title, poster }: MovieCardProps) {
    return (
        <Link
            href={`/movies/${id}`}
            className="group block transition hover:scale-[1.02]">
            <div className="">
                <img
                    src={poster}
                    alt={title}
                    className="w-full rounded-xl object-cover transition-transform duration-300"
                />
            </div>

            <h2 className="mt-3 text-lg font-semibold group-hover:text-green-400">
                {title}
            </h2>
        </Link>
    );
}
