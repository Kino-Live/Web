import Button from "@/components/ui/button";
import {API_BASE_URL} from "@/app/lib/config";


export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await fetch(`${API_BASE_URL}/movies/${id}`);
    const movie = await res.json();

    return (
        <main className="container mx-auto p-8">
            <div className="flex gap-8 items-start mb-5">
                <div className="flex-1">
                    <div className="flex gap-8 items-start">
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

                    <div className="mt-6 flex flex-col">
                        <Button variant="outline" size="md" href="/" className="mb-3">
                            Watch Trailer
                        </Button>
                        <Button variant="primary" size="md" href="/">
                            Watch Online
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
