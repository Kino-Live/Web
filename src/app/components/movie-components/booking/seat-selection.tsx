"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session, Hall, Seat } from "@/app/lib/types/movie";
import { useTickets } from "@/app/lib/hooks/useTickets";
import {
    generateSeatGrid,
    toggleSeatSelection,
    getSeatStatus,
} from "@/app/lib/utils/seat";
import { createPaymentParams, buildPaymentUrl } from "@/app/lib/utils/booking";
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
    const router = useRouter();
    const {
        tickets,
        loading: ticketsLoading,
        refetch: refetchTickets,
    } = useTickets(sessionId);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [booking, setBooking] = useState(false);
    const [appliedPromocode, setAppliedPromocode] = useState<{ promocode: any; discount: number; finalPrice: number } | null>(null);

    // Генерируем сетку мест с учетом занятых и выбранных мест
    const seats = useMemo(
        () => generateSeatGrid(hall.rows, hall.cols, tickets, selectedSeats),
        [hall.rows, hall.cols, tickets, selectedSeats]
    );

    const totalPrice = useMemo(
        () => selectedSeats.length * session.price,
        [selectedSeats.length, session.price]
    );

    // Пересчитываем скидку при изменении totalPrice, если промокод применен
    useEffect(() => {
        if (appliedPromocode) {
            const newDiscount = Math.round((totalPrice * appliedPromocode.promocode.value) / 100);
            const newFinalPrice = totalPrice - newDiscount;
            setAppliedPromocode({ ...appliedPromocode, discount: newDiscount, finalPrice: newFinalPrice });
        }
    }, [totalPrice]);

    // Финальная цена с учетом промокода
    const finalPrice = appliedPromocode ? appliedPromocode.finalPrice : totalPrice;

    const handlePromocodeChange = useCallback((promocode: any, discount: number, finalPrice: number) => {
        if (promocode) {
            setAppliedPromocode({ promocode, discount, finalPrice });
        } else {
            setAppliedPromocode(null);
        }
    }, []);

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

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            alert("Пожалуйста, выберите хотя бы одно место");
            return;
        }

        setBooking(true);
        try {
            const paymentParams = createPaymentParams(
                sessionId,
                session,
                selectedSeats,
                appliedPromocode ? finalPrice : totalPrice,
                appliedPromocode?.promocode?.code || null
            );
            const paymentUrl = buildPaymentUrl(paymentParams);
            router.push(paymentUrl);
        } catch (error) {
            console.error("Ошибка при переходе к оплате:", error);
            setBooking(false);
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
                onPromocodeChange={handlePromocodeChange}
            />
        </div>
    );
}
