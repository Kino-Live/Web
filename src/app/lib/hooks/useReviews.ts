import { useState, useEffect, useCallback } from "react";
import type { Review, ReviewStats, CreateReviewRequest } from "../types/review";

interface UseReviewsReturn {
    reviews: Review[];
    stats: ReviewStats | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createReview: (data: CreateReviewRequest) => Promise<Review>;
    updateReview: (id: string | number, rating: number, text: string) => Promise<Review>;
    deleteReview: (id: string | number) => Promise<void>;
}

/**
 * Хук для работы с отзывами фильма
 */
export function useReviews(movieId: number | string): UseReviewsReturn {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/reviews?movieId=${movieId}`);
            if (!res.ok) {
                throw new Error("Failed to load reviews");
            }
            const data: { reviews: Review[] } = await res.json();
            setReviews(data.reviews || []);

            // Вычисляем статистику
            if (data.reviews && data.reviews.length > 0) {
                const totalRating = data.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                );
                const averageRating = totalRating / data.reviews.length;
                setStats({
                    averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
                    totalReviews: data.reviews.length,
                });
            } else {
                setStats({ averageRating: 0, totalReviews: 0 });
            }
            setLoading(false);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            setLoading(false);
        }
    }, [movieId]);

    const createReview = useCallback(
        async (data: CreateReviewRequest): Promise<Review> => {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to create review");
            }

            const responseData: { review: Review } = await res.json();
            await fetchReviews(); // Обновляем список
            return responseData.review;
        },
        [fetchReviews]
    );

    const updateReview = useCallback(
        async (
            id: string | number,
            rating: number,
            text: string
        ): Promise<Review> => {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rating, text }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update review");
            }

            const responseData: { review: Review } = await res.json();
            await fetchReviews(); // Обновляем список
            return responseData.review;
        },
        [fetchReviews]
    );

    const deleteReview = useCallback(
        async (id: string | number): Promise<void> => {
            const res = await fetch(`/api/reviews/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete review");
            }

            await fetchReviews(); // Обновляем список
        },
        [fetchReviews]
    );

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return {
        reviews,
        stats,
        loading,
        error,
        refetch: fetchReviews,
        createReview,
        updateReview,
        deleteReview,
    };
}
