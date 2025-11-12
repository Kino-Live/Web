"use client";

import { useRef } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { formatDate, getDayName } from "@/app/lib/utils/date";

interface DatePickerProps {
    dates: string[];
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
}

export default function DatePicker({
    dates,
    selectedDate,
    onDateSelect,
}: DatePickerProps) {
    const dateScrollRef = useRef<HTMLDivElement>(null);

    const scrollDates = (direction: "left" | "right") => {
        if (dateScrollRef.current) {
            const scrollAmount = 200;
            dateScrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">Date</h2>
            <div className="flex items-center max-w-sm">
                <button
                    onClick={() => scrollDates("left")}
                    className="hover:text-green-400 transition-colors mr-2 z-10 bg-transparent border-none cursor-pointer">
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <div
                    ref={dateScrollRef}
                    className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {dates.map((date) => {
                        const { day, month } = formatDate(date);
                        const isSelected = selectedDate === date;
                        return (
                            <button
                                key={date}
                                onClick={() => onDateSelect(date)}
                                className={`
                                    flex flex-col items-center justify-center px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap
                                    ${
                                        isSelected
                                            ? "bg-green-400 border-green-400 text-white"
                                            : "border-white text-white hover:border-green-400"
                                    }
                                `}>
                                <span className="font-semibold text-lg">
                                    {day} {month}
                                </span>
                                <span className="text-md">
                                    {getDayName(date)}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => scrollDates("right")}
                    className="hover:text-green-400 transition-colors ml-2 z-10 bg-transparent border-none cursor-pointer">
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}

