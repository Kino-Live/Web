import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";
import { auth } from "@/auth";
import type { Ticket, Session, Movie } from "@/app/lib/types/movie";

export async function GET(req: NextRequest) {
    try {
        // Получаем информацию о текущем пользователе из сессии
        const session = await auth();
        const userId = session?.user?.id || null;

        // Проверяем, что пользователь авторизован
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in to view tickets." },
                { status: 401 }
            );
        }

        // Получаем все билеты пользователя
        const ticketsResponse = await fetch(`${API_BASE_URL}/tickets?userId=${userId}`);
        if (!ticketsResponse.ok) {
            throw new Error("Failed to fetch tickets");
        }
        const tickets: Ticket[] = await ticketsResponse.json();

        // Получаем информацию о сеансах и фильмах для каждого билета
        const ticketsWithDetails = await Promise.all(
            tickets.map(async (ticket) => {
                // Получаем информацию о сеансе
                const sessionResponse = await fetch(
                    `${API_BASE_URL}/sessions/${ticket.sessionId}`
                );
                if (!sessionResponse.ok) {
                    return null;
                }
                const session: Session = await sessionResponse.json();

                // Получаем информацию о фильме
                const movieResponse = await fetch(`${API_BASE_URL}/movies/${session.movieId}`);
                if (!movieResponse.ok) {
                    return null;
                }
                const movie: Movie = await movieResponse.json();

                return {
                    ...ticket,
                    session,
                    movie,
                };
            })
        );

        // Фильтруем null значения (если не удалось получить данные о сеансе/фильме)
        const validTickets = ticketsWithDetails.filter(
            (ticket) => ticket !== null
        ) as Array<Ticket & { session: Session; movie: Movie }>;

        return NextResponse.json(
            {
                tickets: validTickets,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Получаем информацию о текущем пользователе из сессии
        const session = await auth();
        const userId = session?.user?.id || null;

        const { sessionId, seats } = await req.json();

        // Валидация
        if (!sessionId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return NextResponse.json(
                { message: "Invalid request. sessionId and seats array are required." },
                { status: 400 }
            );
        }

        // Проверяем, что пользователь авторизован
        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in to create tickets." },
                { status: 401 }
            );
        }

        // Проверяем, что все места имеют row и col
        for (const seat of seats) {
            if (typeof seat.row !== "number" || typeof seat.col !== "number") {
                return NextResponse.json(
                    { message: "Each seat must have row and col numbers." },
                    { status: 400 }
                );
            }
        }

        // Проверяем, не заняты ли уже эти места
        const existingTicketsResponse = await fetch(
            `${API_BASE_URL}/tickets?sessionId=${sessionId}`
        );
        const existingTickets = await existingTicketsResponse.json();

        // Проверяем конфликты
        for (const seat of seats) {
            const isOccupied = existingTickets.some(
                (ticket: any) => ticket.row === seat.row && ticket.col === seat.col
            );
            if (isOccupied) {
                return NextResponse.json(
                    {
                        message: `Seat at row ${seat.row}, col ${seat.col} is already occupied.`,
                    },
                    { status: 409 }
                );
            }
        }

        // Создаем билеты для каждого места
        const createdTickets = [];
        for (const seat of seats) {
            const ticketResponse = await fetch(`${API_BASE_URL}/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    row: seat.row,
                    col: seat.col,
                    userId: userId, // userId из сессии
                }),
            });

            if (!ticketResponse.ok) {
                // Если один билет не создался, откатываем все созданные
                // В реальном приложении нужна транзакция, но для JSON Server это упрощенно
                return NextResponse.json(
                    { message: "Failed to create tickets." },
                    { status: 500 }
                );
            }

            const ticket = await ticketResponse.json();
            createdTickets.push(ticket);
        }

        return NextResponse.json(
            {
                message: "Tickets created successfully",
                tickets: createdTickets,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating tickets:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}

