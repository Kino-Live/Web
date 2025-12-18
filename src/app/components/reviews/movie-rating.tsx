"use client";

import { useReviews } from "@/app/lib/hooks/useReviews";
import RatingBlock from "./rating-block";

interface MovieRatingProps {
    movieId: number | string;
}

/**
 * Клиентский компонент-обертка для блока рейтинга фильма
 */
export default function MovieRating({ movieId }: MovieRatingProps) {
    const { stats, loading } = useReviews(movieId);

    return <RatingBlock stats={stats} loading={loading} />;
}
