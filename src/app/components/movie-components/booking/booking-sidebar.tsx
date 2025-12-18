"use client";

import { useState } from "react";
import { Seat, Session } from "@/app/lib/types/movie";
import { rowToLetter } from "@/app/lib/utils/seat";
import Button from "@/app/components/ui/button";
import type { Promocode, PromocodeValidationResult } from "@/app/lib/types/promocode";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface BookingSidebarProps {
    selectedSeats: Seat[];
    session: Session;
    totalPrice: number;
    onConfirm: () => void;
    onSeatRemove: (row: number, col: number) => void;
    booking?: boolean;
    onPromocodeChange?: (promocode: Promocode | null, discount: number, finalPrice: number) => void;
}

export default function BookingSidebar({
    selectedSeats,
    session,
    totalPrice,
    onConfirm,
    onSeatRemove,
    booking = false,
    onPromocodeChange,
}: BookingSidebarProps) {
    const [promocodeInput, setPromocodeInput] = useState("");
    const [promocodeStatus, setPromocodeStatus] = useState<{
        type: "success" | "error" | null;
        message: string;
    }>({ type: null, message: "" });
    const [appliedPromocode, setAppliedPromocode] = useState<Promocode | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Вычисляем финальную цену с учетом промокода
    const discount = appliedPromocode
        ? Math.round((totalPrice * appliedPromocode.value) / 100)
        : 0;
    const finalPrice = totalPrice - discount;

    const handleApplyPromocode = async () => {
        if (!promocodeInput.trim()) {
            setPromocodeStatus({
                type: "error",
                message: "Введите промокод",
            });
            return;
        }

        setIsValidating(true);
        setPromocodeStatus({ type: null, message: "" });

        try {
            const res = await fetch("/api/promocodes/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: promocodeInput.trim() }),
            });

            const result: PromocodeValidationResult = await res.json();

            if (result.valid && result.promocode) {
                setAppliedPromocode(result.promocode);
                setPromocodeStatus({
                    type: "success",
                    message: result.message,
                });
                // Вычисляем скидку и финальную цену
                const newDiscount = Math.round((totalPrice * result.promocode.value) / 100);
                const newFinalPrice = totalPrice - newDiscount;
                if (onPromocodeChange) {
                    onPromocodeChange(result.promocode, newDiscount, newFinalPrice);
                }
            } else {
                setAppliedPromocode(null);
                setPromocodeStatus({
                    type: "error",
                    message: result.message,
                });
                if (onPromocodeChange) {
                    onPromocodeChange(null, 0, totalPrice);
                }
            }
        } catch (error) {
            console.error("Error validating promocode:", error);
            setPromocodeStatus({
                type: "error",
                message: "Ошибка при проверке промокода",
            });
            setAppliedPromocode(null);
            if (onPromocodeChange) {
                onPromocodeChange(null, 0, totalPrice);
            }
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemovePromocode = () => {
        setPromocodeInput("");
        setAppliedPromocode(null);
        setPromocodeStatus({ type: null, message: "" });
        if (onPromocodeChange) {
            onPromocodeChange(null, 0, totalPrice);
        }
    };

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

                {/* Блок промокода */}
                <div className="border-t border-gray-700 pt-4 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                        Promocode
                    </h3>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promocodeInput}
                                onChange={(e) => setPromocodeInput(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleApplyPromocode();
                                    }
                                }}
                                placeholder="Enter promocode"
                                disabled={isValidating || !!appliedPromocode}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {appliedPromocode ? (
                                <button
                                    onClick={handleRemovePromocode}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                    title="Remove promocode"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleApplyPromocode}
                                    disabled={isValidating || !promocodeInput.trim()}
                                    className="px-4 py-2 rounded-lg bg-green-400 text-white hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isValidating ? (
                                        <span className="text-sm">...</span>
                                    ) : (
                                        <CheckIcon className="h-5 w-5" />
                                    )}
                                </button>
                            )}
                        </div>
                        {promocodeStatus.message && (
                            <p
                                className={`text-sm ${
                                    promocodeStatus.type === "success"
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >
                                {promocodeStatus.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Итого */}
                <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-white">
                                Total:
                            </span>
                            <span className="text-lg font-semibold text-white">
                                {totalPrice} ₴
                            </span>
                        </div>
                        {appliedPromocode && discount > 0 && (
                            <>
                                <div className="flex justify-between items-center text-green-400">
                                    <span className="text-sm">Discount ({appliedPromocode.value}%):</span>
                                    <span className="text-sm font-semibold">-{discount} ₴</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                                    <span className="text-lg font-semibold text-white">
                                        Final Price:
                                    </span>
                                    <span className="text-2xl font-bold text-green-400">
                                        {finalPrice} ₴
                                    </span>
                                </div>
                            </>
                        )}
                        {!appliedPromocode && (
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-white">
                                    Final Price:
                                </span>
                                <span className="text-2xl font-bold text-green-400">
                                    {totalPrice} ₴
                                </span>
                            </div>
                        )}
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

