import Image from "next/image";

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:5000/movies/${id}`);
    const movie = await res.json();

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-6 md:flex-row">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={56}
                        height={80}
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {movie.title}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {movie.description}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
