import Button from "@/components/ui/button";

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetch(`http://localhost:5000/movies/${id}`);
    const movie = await res.json();

    return (
        <main className="container mx-auto p-8">
            <div className="flex gap-8 items-start mb-5">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="rounded-lg max-w-xs"
                />

                <div className="flex flex-col gap-4">
                    <h1 className="text-5xl font-bold">
                        {movie.title}
                    </h1>

                    <div className="space-y-2">
                        {Object.entries(movie).map(([key, value]) => {
                            if (
                                [
                                    "id",
                                    "title",
                                    "poster",
                                    "description",
                                ].includes(key)
                            )
                                return null;

                            const label = key;

                            return (
                                <p key={key} className="text-md">
                                    <span className="font-medium">
                                        {label}:{" "}
                                    </span>
                                    <span className="text-gray-400">
                                        {String(value)}
                                    </span>
                                </p>
                            );
                        })}
                    </div>
                    <p className="max-w-xl text-lg">{movie.description}</p>
                </div>
            </div>
            <Button variant="outline" size="md" href="/" className="mb-3">
                Watch Trailer
            </Button>
            <Button variant="primary" size="md" href="/">
                Watch Online
            </Button>
        </main>
    );
}
