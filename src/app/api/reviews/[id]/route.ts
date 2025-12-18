import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";
import { auth } from "@/auth";
import type { Review } from "@/app/lib/types/review";

/**
 * PUT - Обновление отзыва
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const userId = session?.user?.id || null;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in to edit reviews." },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();
        const { rating, text } = body;

        // Получаем текущий отзыв
        const reviewResponse = await fetch(`${API_BASE_URL}/reviews/${id}`);
        if (!reviewResponse.ok) {
            return NextResponse.json(
                { message: "Review not found" },
                { status: 404 }
            );
        }

        const review: Review = await reviewResponse.json();

        // Проверяем, что пользователь является автором
        if (review.userId !== userId) {
            return NextResponse.json(
                { message: "You can only edit your own reviews" },
                { status: 403 }
            );
        }

        // Проверяем, что userId не null (для анонимных отзывов редактирование запрещено)
        if (!review.userId) {
            return NextResponse.json(
                { message: "Anonymous reviews cannot be edited" },
                { status: 403 }
            );
        }

        // Валидация обновленных данных
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return NextResponse.json(
                    { message: "Rating must be between 1 and 5" },
                    { status: 400 }
                );
            }
        }

        if (text !== undefined) {
            if (text.trim().length === 0) {
                return NextResponse.json(
                    { message: "Review text cannot be empty" },
                    { status: 400 }
                );
            }
            if (text.length > 800) {
                return NextResponse.json(
                    { message: "Text must be no more than 800 characters" },
                    { status: 400 }
                );
            }
        }

        // Обновляем отзыв
        const updateData: Partial<Review> = {};
        if (rating !== undefined) updateData.rating = Number(rating);
        if (text !== undefined) updateData.text = text.trim();

        const updateResponse = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update review");
        }

        const updatedReview: Review = await updateResponse.json();

        return NextResponse.json(
            { message: "Review updated successfully", review: updatedReview },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Удаление отзыва
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const userId = session?.user?.id || null;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in to delete reviews." },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Получаем текущий отзыв
        const reviewResponse = await fetch(`${API_BASE_URL}/reviews/${id}`);
        if (!reviewResponse.ok) {
            return NextResponse.json(
                { message: "Review not found" },
                { status: 404 }
            );
        }

        const review: Review = await reviewResponse.json();

        // Проверяем, что пользователь является автором
        if (review.userId !== userId) {
            return NextResponse.json(
                { message: "You can only delete your own reviews" },
                { status: 403 }
            );
        }

        // Проверяем, что userId не null
        if (!review.userId) {
            return NextResponse.json(
                { message: "Anonymous reviews cannot be deleted" },
                { status: 403 }
            );
        }

        // Удаляем отзыв
        const deleteResponse = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: "DELETE",
        });

        if (!deleteResponse.ok) {
            throw new Error("Failed to delete review");
        }

        return NextResponse.json(
            { message: "Review deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}
