"use client";

import { useEffect, useMemo, useState } from "react";
import MovieCard from "@/components/movie-components/movie-card";
import {API_BASE_URL} from "@/app/lib/config";
interface Movie {
    id: number | string;
    title: string;
    poster: string;
    Genre?: string;
}


function useDebounce<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
}

export default function SearchMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [query, setQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        let isMounted = true;

        async function fetchMovies() {
            try {
                const res = await fetch(`${API_BASE_URL}/movies`, {
                    cache: "no-store",
                });
                if (!res.ok) throw new Error("Failed to load movies");
                const data: Movie[] = await res.json();
                if (isMounted) {
                    setMovies(data);
                    setLoading(false);
                }
            } catch (e) {
                if (isMounted) {
                    setError(e instanceof Error ? e.message : "Unknown error");
                    setLoading(false);
                }
            }
        }

        fetchMovies();
        return () => {
            isMounted = false;
        };
    }, []);

    const genres = useMemo(() => {
        const set = new Set<string>();
        for (const m of movies) {
            if (m.Genre?.trim()) set.add(m.Genre.trim());
        }
        return Array.from(set).sort();
    }, [movies]);

    const filteredMovies = useMemo(() => {
        const q = debouncedQuery.trim().toLowerCase();
        return movies.filter((m) => {
            const matchesQuery = !q || m.title.toLowerCase().includes(q);
            const matchesGenre = !selectedGenre || m.Genre === selectedGenre;
            return matchesQuery && matchesGenre;
        });
    }, [movies, debouncedQuery, selectedGenre]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-400 text-lg">Loading movies...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-8 container mx-auto">
            <h1 className="mb-6 text-center text-4xl font-bold">Now Showing</h1>

            <div className="mb-8 flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-green-500 transition"
                />

                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="flex-1 md:max-w-xs rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-green-500 transition">
                    <option value="">All genres</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </div>

            {filteredMovies.length === 0 ? (
                <p className="text-center text-zinc-400 text-lg">
                    No movies found matching your search.
                </p>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredMovies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            poster={movie.poster}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}
