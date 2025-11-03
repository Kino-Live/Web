import MovieCard from "@/components/movie-components/movie-card";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function MoviesPage() {
    const res = await fetch(`${API_BASE_URL}/movies`);

    const movies = await res.json();

    return (
        <main className="min-h-screen px-8 container mx-auto">
            <h1 className="mb-8 text-center text-3xl font-bold">
                Now Showing
            </h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {movies.map((movie: any) => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                    />
                ))}
            </div>
        </main>
    );
}
