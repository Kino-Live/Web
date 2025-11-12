"use client";

import { useState, useMemo } from "react";
import { Session, Hall, Seat, Ticket } from "@/app/lib/types/movie";
import { useTickets, useBookTickets } from "@/app/lib/hooks/useTickets";
import {
    generateSeatGrid,
    toggleSeatSelection,
    getSeatStatus,
    seatsToPositions,
} from "@/app/lib/utils/seat";
import SeatLegend from "@/app/components/movie-components/movie-ui/seat-legend";
import ScreenDisplay from "@/app/components/movie-components/movie-ui/screen-display";
import SeatGrid from "@/app/components/movie-components/booking/seat-grid";
import BookingSidebar from "@/app/components/movie-components/booking/booking-sidebar";

interface SeatSelectionProps {
    sessionId: number;
    session: Session;
    hall: Hall;
}

export default function SeatSelection({
    sessionId,
    session,
    hall,
}: SeatSelectionProps) {
    const {
        tickets,
        loading: ticketsLoading,
        refetch: refetchTickets,
    } = useTickets(sessionId);
    const { bookTickets, booking } = useBookTickets();
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    // Генерируем сетку мест с учетом занятых и выбранных мест
    const seats = useMemo(
        () => generateSeatGrid(hall.rows, hall.cols, tickets, selectedSeats),
        [hall.rows, hall.cols, tickets, selectedSeats]
    );

    const totalPrice = useMemo(
        () => selectedSeats.length * session.price,
        [selectedSeats.length, session.price]
    );

    const handleSeatClick = (row: number, col: number) => {
        const status = getSeatStatus(row, col, tickets, selectedSeats);

        // Нельзя выбрать занятое место
        if (status === "occupied") return;

        // Переключаем выбор места
        setSelectedSeats((prev) => toggleSeatSelection(row, col, prev));
    };

    const handleSeatRemove = (row: number, col: number) => {
        setSelectedSeats((prev) => toggleSeatSelection(row, col, prev));
    };

    const handleConfirm = async () => {
        if (selectedSeats.length === 0) {
            alert("Пожалуйста, выберите хотя бы одно место");
            return;
        }

        try {
            const seatsData = seatsToPositions(selectedSeats);
            await bookTickets(sessionId, seatsData, null);
            await refetchTickets();

            setSelectedSeats([]);
        } catch (error) {
            console.error("Ошибка при бронировании мест:", error);
        }
    };

    if (ticketsLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="flex-1">
                <SeatLegend />
                <ScreenDisplay />
                <SeatGrid
                    seats={seats}
                    hall={hall}
                    onSeatClick={handleSeatClick}
                />
            </div>

            <BookingSidebar
                selectedSeats={selectedSeats}
                session={session}
                totalPrice={totalPrice}
                onConfirm={handleConfirm}
                onSeatRemove={handleSeatRemove}
                booking={booking}
            />
        </div>
    );
}
