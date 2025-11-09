"use client";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/app/lib/config";
import Button from "../ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";


interface Session {
    id: number;
    movieId: number;
    hallId: number;
    date: string;
    time: string;
    format: "2D" | "3D";
    price: number;
}

export default function SessionPicker({ movieId }: { movieId: number }) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null
    );
    const dateScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/sessions?movieId=${movieId}`)
            .then((res) => res.json())
            .then((data: Session[]) => setSessions(data))
            .catch(console.error);
    }, [movieId]);

    // Автоматически выбираем первую дату и первое время при загрузке сеансов
    useEffect(() => {
        if (sessions.length > 0 && !selectedDate) {
            const grouped = sessions.reduce<Record<string, Session[]>>(
                (acc, s) => {
                    (acc[s.date] = acc[s.date] || []).push(s);
                    return acc;
                },
                {}
            );
            const sortedDates = Object.keys(grouped).sort();
            if (sortedDates.length > 0) {
                const firstDate = sortedDates[0];
                const firstDateSessions = grouped[firstDate];
                const firstTime = firstDateSessions
                    .map((s) => s.time)
                    .sort()[0];
                setSelectedDate(firstDate);
                setSelectedTime(firstTime);
                const firstSession = firstDateSessions.find(
                    (s) => s.time === firstTime
                );
                if (firstSession) {
                    setSelectedSession(firstSession);
                }
            }
        }
    }, [sessions, selectedDate]);

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
        // Автоматически выбираем первое время для выбранной даты
        const dateSessions = groupedByDate[date] || [];
        if (dateSessions.length > 0) {
            const firstTime = dateSessions
                .map((s) => s.time)
                .filter((time, index, arr) => arr.indexOf(time) === index)
                .sort()[0];
            setSelectedTime(firstTime);
            const firstSession = dateSessions.find((s) => s.time === firstTime);
            setSelectedSession(firstSession || null);
        } else {
            setSelectedTime(null);
            setSelectedSession(null);
        }
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
        <div className="flex flex-col">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Date</h2>
                <div className=" flex items-center max-w-sm">
                    <button
                        onClick={() => scrollDates("left")}
                        className="hover:text-green-400 transition-colors mr-2 z-10 bg-transparent border-none cursor-pointer">
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <div
                        ref={dateScrollRef}
                        className="flex gap-4 overflow-x-auto min-w-86 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ">
                        {dates.map((date) => {
                            const { day, month } = formatDate(date);
                            const isSelected = selectedDate === date;
                            return (
                                <button
                                    key={date}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                                        flex flex-col items-center justify-center px-5 py-3 rounded-lg border-2 transition-all whitespace-nowrap
                                        ${
                                            isSelected
                                                ? "bg-green-400 border-green-400 text-white"
                                                : "border-white text-white hover:border-green-400"
                                        }
                                    `}>
                                    <span className="font-semibold text-xl">
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

            {selectedDate && (
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4">Time</h2>
                    <div className="grid grid-cols-4 gap-3">
                        {availableTimes.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`
                                        py-3 rounded-lg border-2
                                        font-medium transition-all text-lg
                                        ${
                                            isSelected
                                                ? "bg-green-400 border-green-400"
                                                : "border-white hover:border-green-400"
                                        }
                                    `}>
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            {selectedSession && (
                <div className="flex justify-start">
                    <Button variant="primary" size="md" href={`/movies/${movieId}/seats/${selectedSession.id}`}>Choose Seats</Button>
                </div>
            )}
        </div>
    );
}
