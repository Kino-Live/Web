import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";
import { auth } from "@/auth";
import type { Review } from "@/app/lib/types/review";

/**
 * GET - Получение отзывов для фильма
 * Query params: movieId (обязательный)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const movieId = searchParams.get("movieId");

        if (!movieId) {
            return NextResponse.json(
                { message: "movieId is required" },
                { status: 400 }
            );
        }

        const reviewsResponse = await fetch(
            `${API_BASE_URL}/reviews?movieId=${movieId}&_sort=createdAt&_order=desc`
        );

        if (!reviewsResponse.ok) {
            throw new Error("Failed to fetch reviews");
        }

        const reviews: Review[] = await reviewsResponse.json();

        return NextResponse.json({ reviews }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}

/**
 * POST - Создание нового отзыва
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id || null;

        const body = await req.json();
        const { movieId, authorName, rating, text } = body;

        // Валидация
        if (!movieId || !rating || !text) {
            return NextResponse.json(
                { message: "movieId, rating, and text are required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

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

        // Если пользователь не авторизован, требуется authorName
        if (!userId && !authorName) {
            return NextResponse.json(
                { message: "authorName is required for anonymous reviews" },
                { status: 400 }
            );
        }

        // Получаем имя пользователя из профиля, если авторизован
        let finalAuthorName: string | null = null;
        if (userId) {
            try {
                const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
                if (userResponse.ok) {
                    const user = await userResponse.json();
                    // Формируем имя: name + lastName, или name, или email
                    if (user.name && user.lastName) {
                        finalAuthorName = `${user.name} ${user.lastName}`;
                    } else if (user.name) {
                        finalAuthorName = user.name;
                    } else {
                        finalAuthorName = null; // Будет показано как Anonymous
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        } else {
            finalAuthorName = authorName || null;
        }

        // Создаем отзыв
        const reviewData = {
            movieId,
            userId: userId || null,
            authorName: finalAuthorName,
            rating: Number(rating),
            text: text.trim(),
            createdAt: new Date().toISOString(),
        };

        const reviewResponse = await fetch(`${API_BASE_URL}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData),
        });

        if (!reviewResponse.ok) {
            throw new Error("Failed to create review");
        }

        const review: Review = await reviewResponse.json();

        return NextResponse.json(
            { message: "Review created successfully", review },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}
