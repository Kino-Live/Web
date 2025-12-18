"use client";

import type { Review } from "@/app/lib/types/review";
import ReviewCard from "./review-card";

interface ReviewListProps {
    reviews: Review[];
    currentUserId: string | null;
    onEdit: (id: string | number, rating: number, text: string) => Promise<void>;
    onDelete: (id: string | number) => Promise<void>;
}

/**
 * Компонент списка отзывов
 */
export default function ReviewList({
    reviews,
    currentUserId,
    onEdit,
    onDelete,
}: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">No reviews yet. Be the first to review this movie!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={currentUserId}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
