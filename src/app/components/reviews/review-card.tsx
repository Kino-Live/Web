"use client";

import { useState } from "react";
import type { Review } from "@/app/lib/types/review";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ReviewCardProps {
    review: Review;
    currentUserId: string | null;
    onEdit: (id: string | number, rating: number, text: string) => Promise<void>;
    onDelete: (id: string | number) => Promise<void>;
}

/**
 * Компонент карточки отзыва
 */
export default function ReviewCard({
    review,
    currentUserId,
    onEdit,
    onDelete,
}: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editText, setEditText] = useState(review.text);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const canEdit = review.userId !== null && review.userId === currentUserId;
    // Если userId есть, но authorName null - значит имя не указано в профиле, показываем Anonymous
    // Если userId null - это анонимный отзыв, используем authorName или Anonymous
    const authorName = review.userId 
        ? (review.authorName || "Anonymous")
        : (review.authorName || "Anonymous");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onEdit(review.id, editRating, editText);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update review:", error);
            alert("Failed to update review. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditRating(review.rating);
        setEditText(review.text);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            setIsDeleting(true);
            await onDelete(review.id);
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Failed to delete review. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            return starNumber <= rating ? (
                <StarIcon
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                />
            ) : (
                <StarOutlineIcon
                    key={i}
                    className="h-4 w-4 text-gray-400"
                />
            );
        });
    };

    if (isEditing) {
        return (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                className="focus:outline-none"
                            >
                                {star <= editRating ? (
                                    <StarIcon className="h-6 w-6 text-yellow-400 fill-yellow-400 cursor-pointer" />
                                ) : (
                                    <StarOutlineIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Review</label>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Write your review..."
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || editText.trim().length === 0 || editText.length > 800}
                        className="px-4 py-2 rounded-lg bg-green-400 text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{authorName}</span>
                        <span className="text-gray-400 text-sm">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {renderStars(review.rating)}
                    </div>
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                            title="Edit review"
                        >
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete review"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{review.text}</p>
        </div>
    );
}
