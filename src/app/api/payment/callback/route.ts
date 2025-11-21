import { NextRequest, NextResponse } from "next/server";
import { LiqPayService } from "@/app/lib/services/liqpay.service";
import type { LiqPayCallbackData } from "@/app/lib/types/payment";

/**
 * Обрабатывает callback от LiqPay после оплаты
 * Этот endpoint вызывается сервером LiqPay для уведомления о статусе платежа
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const data = formData.get("data") as string | null;
        const signature = formData.get("signature") as string | null;

        if (!data || !signature) {
            return NextResponse.json(
                { message: "Missing payment data or signature" },
                { status: 400 }
            );
        }

        // Проверяем подпись
        if (!LiqPayService.verifySignature(data, signature)) {
            console.error("Invalid signature from LiqPay callback");
            return NextResponse.json(
                { message: "Invalid signature" },
                { status: 400 }
            );
        }

        // Декодируем данные
        let callbackData: LiqPayCallbackData;
        try {
            callbackData = LiqPayService.decodeData(data);
        } catch (error) {
            console.error("Error decoding callback data:", error);
            return NextResponse.json(
                { message: "Invalid payment data format" },
                { status: 400 }
            );
        }

        const { status, order_id } = callbackData;

        // Проверяем статус оплаты
        if (LiqPayService.isPaymentSuccessful(status)) {
            // В продакшене здесь можно:
            // 1. Найти booking по order_id в базе данных
            // 2. Создать билеты, если они еще не созданы
            // 3. Обновить статус booking
            // 4. Отправить уведомление пользователю

            console.log("Payment successful:", { order_id, status });
            return NextResponse.json({ status: "ok", order_id });
        } else {
            console.log("Payment failed:", { order_id, status });
            return NextResponse.json({ status: "failed", order_id });
        }
    } catch (error) {
        console.error("Error processing payment callback:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
