import type { Session, Seat } from "../types/movie";
import type { PaymentParams } from "../types/payment";
import { seatsToPositions } from "./seat";

/**
 * Создает параметры для перехода на страницу оплаты
 */
export function createPaymentParams(
    sessionId: number,
    session: Session,
    selectedSeats: Seat[],
    finalPrice?: number,
    promocode?: string | null
): PaymentParams {
    const seatsData = seatsToPositions(selectedSeats);
    const totalPrice = finalPrice ?? selectedSeats.length * session.price;
    const description = `Tickets for ${selectedSeats.length} seat(s)${promocode ? ` (Promocode: ${promocode})` : ""}`;

    return {
        sessionId: sessionId.toString(),
        seats: encodeURIComponent(JSON.stringify(seatsData)),
        amount: totalPrice.toString(),
        description,
    };
}

/**
 * Создает URL для страницы оплаты
 */
export function buildPaymentUrl(params: PaymentParams): string {
    const searchParams = new URLSearchParams({
        sessionId: params.sessionId,
        seats: params.seats,
        amount: params.amount,
        description: params.description,
    });
    return `/payment?${searchParams.toString()}`;
}

