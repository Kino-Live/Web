import { useState, useEffect, useCallback } from "react";
import { Ticket, Session, Movie } from "../types/movie";
import { API_BASE_URL } from "../config";

/**
 * Хук для загрузки билетов (занятых мест) для сеанса
 * @param sessionId - ID сеанса
 * @returns объект с билетами, состоянием загрузки и функцией для обновления
 */
export function useTickets(sessionId: number) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/tickets?sessionId=${sessionId}`);
            if (!res.ok) throw new Error("Failed to load tickets");
            const data: Ticket[] = await res.json();
            setTickets(data);
            setLoading(false);
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchTickets();
        }

        return () => {
            isMounted = false;
        };
    }, [fetchTickets]);

    return { tickets, loading, error, refetch: fetchTickets };
}

/**
 * Хук для бронирования мест
 * @returns функция для бронирования и состояние загрузки
 */
export function useBookTickets() {
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bookTickets = async (
        sessionId: number,
        seats: Array<{ row: number; col: number }>,
        userId: string | null = null
    ) => {
        setBooking(true);
        setError(null);

        try {
            const response = await fetch("/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId,
                    seats,
                    userId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to book tickets");
            }

            return data;
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        } finally {
            setBooking(false);
        }
    };

    return { bookTickets, booking, error };
}

/**
 * Тип билета с дополнительной информацией о сеансе и фильме
 */
export interface UserTicket extends Ticket {
    session: Session;
    movie: Movie;
}

/**
 * Хук для загрузки билетов текущего пользователя
 * @returns объект с билетами пользователя, состоянием загрузки и функцией для обновления
 */
export function useUserTickets() {
    const [tickets, setTickets] = useState<UserTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/tickets");
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Please log in to view your tickets");
                }
                throw new Error("Failed to load tickets");
            }
            const data: { tickets: UserTicket[] } = await res.json();
            setTickets(data.tickets || []);
            setLoading(false);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserTickets();
    }, [fetchUserTickets]);

    return { tickets, loading, error, refetch: fetchUserTickets };
}

