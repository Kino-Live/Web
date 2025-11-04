"use client";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/app/lib/config";

interface Session {
    id: number;
    movieId: number;
    hallId: number;
    date: string; // формат YYYY-MM-DD
    time: string; // "18:00"
    format: "2D" | "3D";
    price: number;
}

export default function SessionPicker({ movieId }: { movieId: number }) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const dateScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/sessions?movieId=${movieId}`)
            .then((res) => res.json())
            .then((data: Session[]) => setSessions(data))
            .catch(console.error);
    }, [movieId]);

    const groupedByDate = sessions.reduce<Record<string, Session[]>>(
        (acc, s) => {
            (acc[s.date] = acc[s.date] || []).push(s);
            return acc;
        },
        {}
    );

    const dates = Object.keys(groupedByDate).sort();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleDateString("en-US", { month: "short" });
        return { day, month };
    };

    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { weekday: "short" });
    };

    const scrollDates = (direction: "left" | "right") => {
        if (dateScrollRef.current) {
            const scrollAmount = 200;
            dateScrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedTime(null);
        setSelectedSession(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        const session = sessions.find(
            (s) => s.date === selectedDate && s.time === time
        );
        setSelectedSession(session || null);
    };

    const availableTimes = selectedDate
        ? groupedByDate[selectedDate]
              .map((s) => s.time)
              .filter((time, index, arr) => arr.indexOf(time) === index)
              .sort()
        : [];

    return (
        <div className="mt-8">
            {/* Date Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Date</h2>
                <div className="relative flex items-center max-w-sm">
                    <button
                        onClick={() => scrollDates("left")}
                        className="text-white hover:text-green-400 transition-colors mr-2 z-10 bg-transparent border-none cursor-pointer">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div
                        ref={dateScrollRef}
                        className="flex gap-3 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {dates.map((date) => {
                            const { day, month } = formatDate(date);
                            const isSelected = selectedDate === date;
                            return (
                                <button
                                    key={date}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                                        flex flex-col items-center justify-center
                                        min-w-[80px] px-4 py-3 rounded-lg
                                        border-2 transition-all whitespace-nowrap
                                        ${
                                            isSelected
                                                ? "bg-green-400 border-green-400 text-white"
                                                : "border-white text-white hover:border-green-400"
                                        }
                                    `}>
                                    <span className="font-bold text-sm">
                                        {day} {month}
                                    </span>
                                    <span className="font-bold text-xs">
                                        {getDayName(date)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => scrollDates("right")}
                        className="text-white hover:text-green-400 transition-colors ml-2 z-10 bg-transparent border-none cursor-pointer">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Time Section */}
            {selectedDate && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Time</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {availableTimes.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`
                                        px-4 py-3 rounded-lg border-2
                                        font-bold transition-all
                                        ${
                                            isSelected
                                                ? "bg-green-400 border-green-400 text-white"
                                                : "border-white text-white hover:border-green-400"
                                        }
                                    `}>
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Choose Seats Button */}
            {selectedSession && (
                <div className="mt-6">
                    <a
                        href={`/movies/${movieId}/seats/${selectedSession.id}`}
                        className="
                            inline-flex items-center justify-center
                            w-full px-6 py-3 rounded-lg
                            bg-green-400 text-white font-bold
                            hover:bg-green-500 transition-colors
                            text-center
                        ">
                        Choose seats
                    </a>
                </div>
            )}
        </div>
    );
}
