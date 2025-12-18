/**
 * Типы для системы отзывов
 */

export interface Review {
    id: string | number;
    movieId: number | string;
    userId: string | null;
    authorName: string | null;
    rating: number; // 1-5
    text: string;
    createdAt: string; // ISO date string
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

export interface CreateReviewRequest {
    movieId: number | string;
    userId?: string | null;
    authorName?: string | null;
    rating: number;
    text: string;
}

export interface UpdateReviewRequest {
    rating?: number;
    text?: string;
}

export interface ReviewFormData {
    rating: number;
    text: string;
    authorName?: string;
}
