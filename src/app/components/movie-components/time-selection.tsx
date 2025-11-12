"use client";

import { useEffect, useState, useMemo } from "react";
import { Session } from "@/app/lib/types/movie";
import { useSessions, groupSessionsByDate, getAvailableTimes } from "@/app/lib/hooks/useSessions";
import DatePicker from "@/app/components/movie-components/date-picker";
import TimePicker from "@/app/components/movie-components/time-picker";
import Button from "@/app/components/ui/button";

interface SessionPickerProps {
    movieId: number;
}

export default function SessionPicker({ movieId }: SessionPickerProps) {
    const { sessions, loading } = useSessions(movieId);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const groupedByDate = useMemo(
        () => groupSessionsByDate(sessions),
        [sessions]
    );

    const dates = useMemo(
        () => Object.keys(groupedByDate).sort(),
        [groupedByDate]
    );

    const availableTimes = useMemo(
        () => (selectedDate ? getAvailableTimes(sessions, selectedDate) : []),
        [sessions, selectedDate]
    );

    // Автоматически выбираем первую дату и первое время при загрузке сеансов
    useEffect(() => {
        if (sessions.length > 0 && !selectedDate && dates.length > 0) {
            const firstDate = dates[0];
            const firstDateSessions = groupedByDate[firstDate];
            if (firstDateSessions.length > 0) {
                const firstTime = getAvailableTimes(sessions, firstDate)[0];
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
    }, [sessions, selectedDate, dates, groupedByDate]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        const dateSessions = groupedByDate[date] || [];
        if (dateSessions.length > 0) {
            const firstTime = getAvailableTimes(sessions, date)[0];
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-white">Loading sessions...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <DatePicker
                dates={dates}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
            />

            {selectedDate && (
                <TimePicker
                    times={availableTimes}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeSelect}
                />
            )}

            {selectedSession && (
                <div className="flex justify-start">
                    <Button
                        variant="primary"
                        size="md"
                        href={`/movies/${movieId}/seats/${selectedSession.id}`}>
                        Choose Seats
                    </Button>
                </div>
            )}
        </div>
    );
}
