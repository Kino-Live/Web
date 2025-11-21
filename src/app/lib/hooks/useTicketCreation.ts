import { useState, useCallback } from "react";
import type { CreateTicketsRequest, CreateTicketsResponse } from "../types/payment";

interface UseTicketCreationReturn {
    createTickets: (request: CreateTicketsRequest) => Promise<CreateTicketsResponse>;
    loading: boolean;
    error: string | null;
}

/**
 * Хук для создания билетов после успешной оплаты
 */
export function useTicketCreation(): UseTicketCreationReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTickets = useCallback(
        async (request: CreateTicketsRequest): Promise<CreateTicketsResponse> => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/tickets", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(request),
                });

                const data: CreateTicketsResponse = await response.json();
                const status = response.status;

                // Если билеты уже созданы (идемпотентность), это тоже успех
                if (
                    data.message === "Tickets created successfully" ||
                    (status === 409 && data.message?.includes("already occupied"))
                ) {
                    return data;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Failed to create tickets");
                }

                return data;
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to create tickets";
                setError(message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { createTickets, loading, error };
}

