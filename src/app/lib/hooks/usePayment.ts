import { useState, useCallback } from "react";
import type { PaymentRequest, PaymentResponse } from "../types/payment";
import { PAYMENT_ROUTES } from "../config/payment";

interface UsePaymentReturn {
    generatePayment: (request: PaymentRequest) => Promise<PaymentResponse>;
    loading: boolean;
    error: string | null;
}

/**
 * Хук для генерации данных платежа
 */
export function usePayment(): UsePaymentReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePayment = useCallback(async (request: PaymentRequest): Promise<PaymentResponse> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(PAYMENT_ROUTES.generate, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to generate payment");
            }

            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to initialize payment";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { generatePayment, loading, error };
}

