"use client";

import { useEffect, useState } from "react";
import Button from "@/app/components/ui/button";
import { API_BASE_URL } from "@/app/lib/config";

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

export default function SeatSelection({ sessionId }: { sessionId: number }) {
    const [session, setSession] = useState<Session | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);
    const [occupiedSeats, setOccupiedSeats] = useState<Ticket[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем информацию о сессии
        fetch(`${API_BASE_URL}/sessions/${sessionId}`)
            .then((res) => res.json())
            .then((data: Session) => {
                setSession(data);
                // Загружаем информацию о зале
                return fetch(`${API_BASE_URL}/halls/${data.hallId}`);
            })
            .then((res) => res.json())
            .then((data: Hall) => {
                setHall(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        // Загружаем занятые места для этой сессии
        fetch(`${API_BASE_URL}/tickets?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data: Ticket[]) => {
                setOccupiedSeats(data);
            })
            .catch(console.error);
    }, [sessionId]);

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
            setSelectedSeats([...selectedSeats, { row, col, status: "selected" }]);
        }
    };

    const totalPrice = session
        ? selectedSeats.length * session.price
        : 0;

    const handleConfirm = () => {
        if (selectedSeats.length === 0) {
            alert("Пожалуйста, выберите хотя бы одно место");
            return;
        }

        // Здесь можно добавить логику для создания билетов
        // Например, отправка запроса на сервер для бронирования мест
        console.log("Выбранные места:", selectedSeats);
        alert(`Выбрано мест: ${selectedSeats.length}. Итоговая стоимость: ${totalPrice}₴`);
    };

    if (loading || !hall || !session) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-white">Загрузка...</p>
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

    return (
        <div className="mt-8">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                    Выбор мест
                </h2>
                <p className="text-gray-400">
                    Зал: {hall.name} • {session.date} • {session.time} • {session.format}
                </p>
            </div>

            {/* Легенда */}
            <div className="flex gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-600 border border-gray-500 rounded"></div>
                    <span className="text-gray-400">Доступно</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-400 border border-green-500 rounded"></div>
                    <span className="text-gray-400">Выбрано</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 border border-red-700 rounded"></div>
                    <span className="text-gray-400">Занято</span>
                </div>
            </div>

            {/* Экран */}
            <div className="mb-6">
                <div className="bg-gray-700 text-center py-2 rounded-lg mb-4">
                    <p className="text-white font-semibold">ЭКРАН</p>
                </div>
            </div>

            {/* Сетка мест */}
            <div className="flex flex-col gap-2 mb-8">
                {/* Заголовки колонок */}
                <div className="flex gap-1 justify-center mb-2">
                    <div className="w-8"></div>
                    {Array.from({ length: hall.cols }, (_, i) => (
                        <div
                            key={i + 1}
                            className="w-8 text-center text-gray-400 text-sm">
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Ряды мест */}
                {seats.map((rowSeats, rowIndex) => (
                    <div key={rowIndex + 1} className="flex gap-1 items-center">
                        {/* Номер ряда */}
                        <div className="w-8 text-gray-400 text-sm text-center">
                            {String.fromCharCode(64 + rowIndex + 1)}
                        </div>
                        {/* Места в ряду */}
                        {rowSeats.map((seat) => (
                            <button
                                key={`${seat.row}-${seat.col}`}
                                onClick={() => handleSeatClick(seat.row, seat.col)}
                                disabled={seat.status === "occupied"}
                                className={`
                                    w-8 h-8 rounded border transition-all
                                    ${
                                        seat.status === "available"
                                            ? "bg-gray-600 border-gray-500 hover:bg-gray-500 cursor-pointer"
                                            : seat.status === "selected"
                                            ? "bg-green-400 border-green-500 cursor-pointer"
                                            : "bg-red-600 border-red-700 cursor-not-allowed opacity-50"
                                    }
                                `}
                                title={`Ряд ${String.fromCharCode(64 + seat.row)}, Место ${seat.col}`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Выбранные места и итоговая стоимость */}
            {selectedSeats.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Выбранные места
                    </h3>
                    <div className="space-y-2 mb-4">
                        {selectedSeats.map((seat, index) => (
                            <div
                                key={index}
                                className="flex justify-between text-gray-300">
                                <span>
                                    Ряд {String.fromCharCode(64 + seat.row)},
                                    Место {seat.col}
                                </span>
                                <span className="text-green-400">
                                    {session.price}₴
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
                        <span className="text-xl font-semibold text-white">
                            Итого:
                        </span>
                        <span className="text-2xl font-bold text-green-400">
                            {totalPrice}₴
                        </span>
                    </div>
                </div>
            )}

            {/* Кнопки действий */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="flex-1">
                    Назад
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={selectedSeats.length === 0}
                    className="flex-1">
                    Подтвердить выбор
                </Button>
            </div>
        </div>
    );
}

