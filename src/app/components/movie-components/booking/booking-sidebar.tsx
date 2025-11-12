"use client";

import { Seat, Session } from "@/app/lib/types/movie";
import { rowToLetter } from "@/app/lib/utils/seat";
import Button from "@/app/components/ui/button";

interface BookingSidebarProps {
    selectedSeats: Seat[];
    session: Session;
    totalPrice: number;
    onConfirm: () => void;
    onSeatRemove: (row: number, col: number) => void;
    booking?: boolean;
}

export default function BookingSidebar({
    selectedSeats,
    session,
    totalPrice,
    onConfirm,
    onSeatRemove,
    booking = false,
}: BookingSidebarProps) {
    return (
        <div className="">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
                {/* Секция Квитки */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            Tickets
                        </h3>
                        <span className="text-sm text-gray-400">
                            {selectedSeats.length} tickets, {totalPrice} ₴
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
                                With online tickets, no need to print out
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
                                                Row {rowToLetter(seat.row)}, Seat{" "}
                                                {seat.col}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {session.format}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                onSeatRemove(seat.row, seat.col)
                                            }
                                            className="text-gray-400 hover:text-white transition-colors cursor-pointer">
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
                                            Standart
                                        </span>
                                        <span className="text-green-400 font-semibold">
                                            {session.price} ₴
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
                            Total:
                        </span>
                        <span className="text-2xl font-bold text-green-400">
                            {totalPrice} ₴
                        </span>
                    </div>
                </div>

                {/* Кнопка Продовжити */}
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={selectedSeats.length === 0 || booking}
                    className="w-full">
                    {booking ? "Booking..." : "Continue"}
                </Button>

                {/* Кнопка Назад */}
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="w-full mt-3">
                    Back
                </Button>
            </div>
        </div>
    );
}

