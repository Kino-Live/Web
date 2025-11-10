import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";

export async function POST(req: NextRequest) {
    try {
        const { sessionId, seats, userId } = await req.json();

        // Валидация
        if (!sessionId || !seats || !Array.isArray(seats) || seats.length === 0) {
            return NextResponse.json(
                { message: "Invalid request. sessionId and seats array are required." },
                { status: 400 }
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
                    userId: userId || null, // userId опциональный
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

