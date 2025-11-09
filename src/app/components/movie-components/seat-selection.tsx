"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/ui/button";
import { API_BASE_URL } from "@/app/lib/config";
import LegendItem from "@/app/components/movie-components/legend-item";

interface Hall {
    id: number;
    name: string;
    rows: number;
    cols: number;
}

interface Session {
    id: number;
    movieId: number;
    hallId: number;
    date: string;
    time: string;
    format: "2D" | "3D";
    price: number;
}

interface Ticket {
    id: number;
    sessionId: number;
    row: number;
    col: number;
    userId: string;
}

type SeatStatus = "available" | "selected" | "occupied";

interface Seat {
    row: number;
    col: number;
    status: SeatStatus;
}

export default function SeatSelection({ 
    sessionId, 
    session, 
    hall 
}: { 
    sessionId: number;
    session: Session;
    hall: Hall;
}) {
    const [occupiedSeats, setOccupiedSeats] = useState<Ticket[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем занятые места для этой сессии
        fetch(`${API_BASE_URL}/tickets?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data: Ticket[]) => {
                setOccupiedSeats(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [sessionId]);

    // Таймер обратного отсче

    const getSeatStatus = (row: number, col: number): SeatStatus => {
        // Проверяем, занято ли место
        const isOccupied = occupiedSeats.some(
            (ticket) => ticket.row === row && ticket.col === col
        );
        if (isOccupied) return "occupied";

        // Проверяем, выбрано ли место
        const isSelected = selectedSeats.some(
            (seat) => seat.row === row && seat.col === col
        );
        if (isSelected) return "selected";

        return "available";
    };

    const handleSeatClick = (row: number, col: number) => {
        const status = getSeatStatus(row, col);

        // Нельзя выбрать занятое место
        if (status === "occupied") return;

        // Переключаем выбор места
        if (status === "selected") {
            setSelectedSeats(
                selectedSeats.filter(
                    (seat) => !(seat.row === row && seat.col === col)
                )
            );
        } else {
            setSelectedSeats([
                ...selectedSeats,
                { row, col, status: "selected" },
            ]);
        }
    };

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            alert("Пожалуйста, выберите хотя бы одно место");
            return;
        }

        console.log("Выбранные места:", selectedSeats);
        alert(
            `Выбрано мест: ${selectedSeats.length}. Итоговая стоимость: ${totalPrice}₴`
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    // Генерируем сетку мест
    const seats: Seat[][] = [];
    for (let row = 1; row <= hall.rows; row++) {
        const rowSeats: Seat[] = [];
        for (let col = 1; col <= hall.cols; col++) {
            rowSeats.push({
                row,
                col,
                status: getSeatStatus(row, col),
            });
        }
        seats.push(rowSeats);
    }

    const totalPrice = session ? selectedSeats.length * session.price : 0;

    return (
        <div className="flex gap-8">
            <div className="flex-1 mt-8">
            <div className="flex gap-4 mb-6 text-sm">
                <LegendItem
                    color="bg-gray-600"
                    borderColor="border-gray-500"
                    label="Доступно"
                />
                <LegendItem
                    color="bg-green-400"
                    borderColor="border-green-500"
                    label="Выбрано"
                />
                <LegendItem
                    color="bg-red-600"
                    borderColor="border-red-700"
                    label="Занято"
                />
            </div>

            {/* Экран */}
            <div className="mx-auto mb-8 w-full max-w-xl text-center text-2xl uppercase font-medium">
                
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 806 21"
                    fill="#FFF">
                    <path d="M3.2,20l-2,0.2l-0.3-4l2-0.2C136.2,5.3,269.6,0,403,0s266.8,5.3,400.2,16l2,0.2l-0.3,4l-2-0.2 C669.5,9.3,536.3,4,403,4S136.4,9.3,3.2,20z"></path>
                </svg>
                Display
            </div>

            {/* Сетка мест */}
            <div className="flex flex-col gap-2 mb-8">
                {/* Заголовки колонок */}
                <div className="flex gap-1 justify-center mb-2">
                    <div className="w-8"></div>
                    {Array.from({ length: hall.cols }, (_, i) => (
                        <div
                            key={i + 1}
                            className="w-8 text-center text-sm">
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Ряды мест */}
                {seats.map((rowSeats, rowIndex) => (
                    <div
                        key={rowIndex + 1}
                        className="flex gap-1 justify-center">
                        {/* Номер ряда */}
                        <div className="w-8 text-sm text-center py-1">
                            {String.fromCharCode(64 + rowIndex + 1)}
                        </div>
                        {/* Места в ряду */}
                        {rowSeats.map((seat) => (
                            <button
                                key={`${seat.row}-${seat.col}`}
                                onClick={() =>
                                    handleSeatClick(seat.row, seat.col)
                                }
                                disabled={seat.status === "occupied"}
                                className={`
                                    w-8 h-8 rounded border transition-all
                                    ${
                                        seat.status === "available"
                                            ? "bg-white border-gray-500 hover:bg-gray-500 cursor-pointer"
                                            : seat.status === "selected"
                                            ? "bg-green-400 border-green-500 cursor-pointer"
                                            : "bg-red-600 border-red-700 cursor-not-allowed opacity-50"
                                    }
                                `}
                                title={`Ряд ${String.fromCharCode(
                                    64 + seat.row
                                )}, Место ${seat.col}`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            </div>

            {/* Sidebar */}
            <div className="w-80">
                <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
                    {/* Таймер */}
                    {selectedSeats.length > 0 && (
                        <div className="flex items-center justify-end gap-2 mb-6 text-sm text-gray-400">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Секция Квитки */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">
                                Квитки
                            </h3>
                            <span className="text-sm text-gray-400">
                                {selectedSeats.length} квитків, {totalPrice} грн
                            </span>
                        </div>

                        {selectedSeats.length === 0 ? (
                            <div className="bg-gray-700 rounded-lg p-8 text-center">
                                <div className="mb-4">
                                    <svg
                                        className="w-16 h-16 mx-auto text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400">
                                    З онлайн квитком відразу в зал!
                                    <br />
                                    Друкувати не потрібно
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedSeats.map((seat, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-white font-medium">
                                                    Ряд{" "}
                                                    {String.fromCharCode(
                                                        64 + seat.row
                                                    )},
                                                    Місце {seat.col}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {session.format}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleSeatClick(
                                                        seat.row,
                                                        seat.col
                                                    )
                                                }
                                                className="text-gray-400 hover:text-white transition-colors">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">
                                                Стандарт
                                            </span>
                                            <span className="text-green-400 font-semibold">
                                                {session.price} грн
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Итого */}
                    <div className="border-t border-gray-700 pt-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-white">
                                Всього до сплати:
                            </span>
                            <span className="text-2xl font-bold text-green-400">
                                {totalPrice} грн
                            </span>
                        </div>
                    </div>

                    {/* Кнопка Продовжити */}
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={selectedSeats.length === 0}
                        className="w-full">
                        Продовжити
                    </Button>

                    {/* Кнопка Назад */}
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-full mt-3">
                        Назад
                    </Button>
                </div>
            </div>
        </div>
    );
}
