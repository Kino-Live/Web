import { NextRequest, NextResponse } from "next/server";
import { LiqPayService } from "@/app/lib/services/liqpay.service";
import type { PaymentRequest } from "@/app/lib/types/payment";

/**
 * Валидирует запрос на создание платежа
 */
function validatePaymentRequest(body: unknown): body is PaymentRequest {
    if (typeof body !== "object" || body === null) {
        return false;
    }

    const request = body as Record<string, unknown>;

    return (
        typeof request.amount === "number" &&
        request.amount > 0 &&
        typeof request.description === "string" &&
        request.description.length > 0 &&
        typeof request.sessionId === "number" &&
        request.sessionId > 0 &&
        Array.isArray(request.seats) &&
        request.seats.length > 0 &&
        request.seats.every(
            (seat: unknown) =>
                typeof seat === "object" &&
                seat !== null &&
                typeof (seat as { row: number }).row === "number" &&
                typeof (seat as { col: number }).col === "number"
        )
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!validatePaymentRequest(body)) {
            return NextResponse.json(
                { message: "Invalid request. All fields are required and must be valid." },
                { status: 400 }
            );
        }

        const orderId = LiqPayService.generateOrderId();
        const { data, signature } = LiqPayService.createPaymentData({
            amount: body.amount,
            description: body.description,
            orderId,
            sessionId: body.sessionId,
            seats: body.seats,
        });

        return NextResponse.json({
            data,
            signature,
            orderId,
        });
    } catch (error) {
        console.error("Error generating payment data:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
