import MovieCard from "@/components/ui/movie-card";

export default async function MoviesPage() {
    const res = await fetch("http://localhost:5000/movies");

    const movies = await res.json();

    return (
        <main className="min-h-screen px-8 max-w-7xl mx-auto py-[130px]">
            <h1 className="mb-8 text-center text-3xl font-bold">
                Now Showing
            </h1>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
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
