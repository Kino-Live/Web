import Button from "@/app/components/ui/button";
import { API_BASE_URL } from "@/app/lib/config";
import SessionPicker from "@/app/components/movie-components/time-selection";

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetch(`${API_BASE_URL}/movies/${id}`);
    const movie = await res.json();

    return (
        <main className="container mx-auto px-8">
            <div className="flex justify-between">
                <div className="flex flex-row gap-8">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="rounded-lg max-w-xs"
                    />
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-bold">{movie.title}</h1>

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
                <SessionPicker movieId={movie.id}/>
            </div>

            <div className="mt-6 flex flex-col">
                <Button variant="outline" size="md" href="/" className="mb-3">
                    Watch Trailer
                </Button>
                <Button variant="primary" size="md" href="/">
                    Watch Online
                </Button>
            </div>
        </main>
    );
}
