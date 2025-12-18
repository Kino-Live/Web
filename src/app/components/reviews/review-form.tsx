"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import type { CreateReviewRequest } from "@/app/lib/types/review";
import Button from "@/app/components/ui/button";

interface ReviewFormProps {
    movieId: number | string;
    userId: string | null;
    onSubmit: (data: CreateReviewRequest) => Promise<void>;
}

/**
 * Компонент формы для добавления отзыва
 */
export default function ReviewForm({
    movieId,
    userId,
    onSubmit,
}: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Валидация
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        if (text.trim().length === 0) {
            setError("Review cannot be empty");
            return;
        }

        if (text.length > 800) {
            setError("Review must be no more than 800 characters long");
            return;
        }

        if (!userId && !authorName.trim()) {
            setError("Please enter your name");
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit({
                movieId,
                userId: userId || null,
                authorName: userId ? null : authorName.trim(),
                rating,
                text: text.trim(),
            });
            // Сбрасываем форму после успешной отправки
            setRating(0);
            setText("");
            setAuthorName("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            return (
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starNumber)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    {starNumber <= rating ? (
                        <StarIcon className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    ) : (
                        <StarOutlineIcon className="h-8 w-8 text-gray-400" />
                    )}
                </button>
            );
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>

            {!userId && (
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                    <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400"
                        required={!userId}
                    />
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rating</label>
                <div className="flex gap-1">{renderStars()}</div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Your Review</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Write your review..."
                    className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                    required
                />
                <p className="text-gray-500 text-xs mt-1">
                    {text.length}/800 characters
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting || rating === 0 || text.trim().length === 0}
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    );
}
