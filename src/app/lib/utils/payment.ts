import type { PaymentParams, PaymentSuccessParams } from "../types/payment";

/**
 * Валидирует параметры платежа из URL
 */
export function validatePaymentParams(params: {
    sessionId: string | null;
    seats: string | null;
    amount: string | null;
    description: string | null;
}): { valid: boolean; error?: string } {
    if (!params.sessionId || !params.seats || !params.amount || !params.description) {
        return { valid: false, error: "Missing required payment parameters" };
    }

    const sessionId = parseInt(params.sessionId);
    if (isNaN(sessionId) || sessionId <= 0) {
        return { valid: false, error: "Invalid session ID" };
    }

    const amount = parseFloat(params.amount);
    if (isNaN(amount) || amount <= 0) {
        return { valid: false, error: "Invalid amount" };
    }

    try {
        const seats = JSON.parse(decodeURIComponent(params.seats));
        if (!Array.isArray(seats) || seats.length === 0) {
            return { valid: false, error: "Invalid seats data" };
        }
    } catch {
        return { valid: false, error: "Invalid seats format" };
    }

    return { valid: true };
}

/**
 * Парсит параметры платежа из URL
 */
export function parsePaymentParams(searchParams: URLSearchParams): PaymentParams | null {
    const sessionId = searchParams.get("sessionId");
    const seats = searchParams.get("seats");
    const amount = searchParams.get("amount");
    const description = searchParams.get("description");

    const validation = validatePaymentParams({ sessionId, seats, amount, description });
    if (!validation.valid) {
        return null;
    }

    return {
        sessionId: sessionId!,
        seats: seats!,
        amount: amount!,
        description: description!,
    };
}

/**
 * Парсит параметры успешной оплаты из URL
 */
export function parsePaymentSuccessParams(searchParams: URLSearchParams): PaymentSuccessParams | null {
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("sessionId");
    const seats = searchParams.get("seats");

    if (!orderId || !sessionId || !seats) {
        return null;
    }

    try {
        JSON.parse(decodeURIComponent(seats));
    } catch {
        return null;
    }

    return {
        orderId,
        sessionId,
        seats,
        amount: searchParams.get("amount") || "",
        description: searchParams.get("description") || "",
    };
}

/**
 * Декодирует данные мест из строки
 */
export function decodeSeats(seatsParam: string): Array<{ row: number; col: number }> {
    return JSON.parse(decodeURIComponent(seatsParam));
}

