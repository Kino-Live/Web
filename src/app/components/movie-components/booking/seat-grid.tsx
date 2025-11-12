"use client";

import { Seat, Hall } from "@/app/lib/types/movie";
import { rowToLetter } from "@/app/lib/utils/seat";

interface SeatGridProps {
    seats: Seat[][];
    hall: Hall;
    onSeatClick: (row: number, col: number) => void;
}

export default function SeatGrid({ seats, hall, onSeatClick }: SeatGridProps) {
    return (
        <div className="flex flex-col gap-2">
            {/* Заголовки колонок */}
            <div className="flex gap-1 justify-center mb-2">
                <div className="w-8"></div>
                {Array.from({ length: hall.cols }, (_, i) => (
                    <div key={i + 1} className="w-8 text-center text-sm">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Ряды мест */}
            {seats.map((rowSeats, rowIndex) => (
                <div key={rowIndex + 1} className="flex gap-1 justify-center">
                    {/* Номер ряда */}
                    <div className="w-8 text-sm text-center py-1">
                        {rowToLetter(rowIndex + 1)}
                    </div>
                    {/* Места в ряду */}
                    {rowSeats.map((seat) => (
                        <button
                            key={`${seat.row}-${seat.col}`}
                            onClick={() => onSeatClick(seat.row, seat.col)}
                            disabled={seat.status === "occupied"}
                            className={`
                                w-8 h-8 rounded border transition-all
                                ${
                                    seat.status === "available"
                                        ? "bg-white border-gray-500 hover:bg-gray-500 cursor-pointer"
                                        : seat.status === "selected"
                                        ? "bg-green-400 border-green-500 cursor-pointer"
                                        : "bg-red-600 border-red-700 cursor-not-allowed"
                                }
                            `}
                            title={`Row ${rowToLetter(seat.row)}, Seat ${seat.col}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

