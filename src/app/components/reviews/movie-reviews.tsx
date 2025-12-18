"use client";

import { useEffect, useState } from "react";
import { useReviews } from "@/app/lib/hooks/useReviews";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";
import type { CreateReviewRequest } from "@/app/lib/types/review";
import Button from "@/app/components/ui/button";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface MovieReviewsProps {
    movieId: number | string;
}

/**
 * Основной компонент для отображения отзывов фильма
 */
export default function MovieReviews({ movieId }: MovieReviewsProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Получаем userId и имя пользователя из сессии
    useEffect(() => {
        fetch("/api/auth/session")
            .then((res) => res.json())
            .then((data) => {
                setUserId(data?.user?.id || null);
                setUserName(data?.user?.name || null);
            })
            .catch(() => {
                setUserId(null);
                setUserName(null);
            });
    }, []);
    const {
        reviews,
        stats,
        loading,
        error,
        createReview,
        updateReview,
        deleteReview,
    } = useReviews(movieId);

    const handleCreateReview = async (data: CreateReviewRequest) => {
        await createReview(data);
        setIsFormOpen(false); // Закрываем форму после успешной отправки
    };

    const handleEditReview = async (
        id: string | number,
        rating: number,
        text: string
    ) => {
        await updateReview(id, rating, text);
    };

    const handleDeleteReview = async (id: string | number) => {
        await deleteReview(id);
    };

    if (error) {
        return (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-6">
            {/* Кнопка для раскрытия формы или сама форма */}
            {!isFormOpen ? (
                <div className="flex justify-start">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsFormOpen(true)}
                    >
                        <div className="flex items-center gap-2">
                            <PlusIcon className="h-5 w-5" />
                            <span>Write a Review</span>
                        </div>
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <button
                        onClick={() => setIsFormOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        title="Close form"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                    <ReviewForm
                        movieId={movieId}
                        userId={userId}
                        onSubmit={handleCreateReview}
                    />
                </div>
            )}

            {/* Список отзывов */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Reviews</h3>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Loading reviews...</p>
                    </div>
                ) : (
                    <ReviewList
                        reviews={reviews}
                        currentUserId={userId}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                    />
                )}
            </div>
        </div>
    );
}
