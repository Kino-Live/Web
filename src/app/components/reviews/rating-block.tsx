import type { ReviewStats } from "@/app/lib/types/review";
import { StarIcon } from "@heroicons/react/24/solid";

interface RatingBlockProps {
    stats: ReviewStats | null;
    loading?: boolean;
}

/**
 * Компонент для отображения блока рейтинга фильма
 */
export default function RatingBlock({ stats, loading = false }: RatingBlockProps) {
    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <div className="text-gray-400">Loading rating...</div>
            </div>
        );
    }

    if (!stats || stats.totalReviews === 0) {
        return (
            <div className="flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-semibold">No reviews yet</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold text-lg">
                {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
                ({stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"})
            </span>
        </div>
    );
}
