import { useState, useEffect } from "react";
import { Session } from "../types/movie";
import { API_BASE_URL } from "../config";

/**
 * Хук для загрузки сеансов фильма
 * @param movieId - ID фильма
 * @returns объект с сеансами и состоянием загрузки
 */
export function useSessions(movieId: number) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchSessions() {
            try {
                const res = await fetch(`${API_BASE_URL}/sessions?movieId=${movieId}`);
                if (!res.ok) throw new Error("Failed to load sessions");
                const data: Session[] = await res.json();
                if (isMounted) {
                    setSessions(data);
                    setLoading(false);
                }
            } catch (e) {
                if (isMounted) {
                    setError(e instanceof Error ? e.message : "Unknown error");
                    setLoading(false);
                }
            }
        }

        fetchSessions();
        return () => {
            isMounted = false;
        };
    }, [movieId]);

    return { sessions, loading, error };
}

/**
 * Группирует сеансы по датам
 * @param sessions - массив сеансов
 * @returns объект с датами в качестве ключей
 */
export function groupSessionsByDate(sessions: Session[]): Record<string, Session[]> {
    return sessions.reduce<Record<string, Session[]>>((acc, session) => {
        if (!acc[session.date]) {
            acc[session.date] = [];
        }
        acc[session.date].push(session);
        return acc;
    }, {});
}

/**
 * Получает уникальные времена для выбранной даты
 * @param sessions - массив сеансов
 * @param date - выбранная дата
 * @returns отсортированный массив уникальных времен
 */
export function getAvailableTimes(sessions: Session[], date: string): string[] {
    const dateSessions = sessions.filter((s) => s.date === date);
    const times = dateSessions.map((s) => s.time);
    return [...new Set(times)].sort();
}

