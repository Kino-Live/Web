import crypto from "crypto";
import { LIQPAY_CONFIG, getBaseUrl } from "../config/payment";
import type { LiqPayPaymentData, LiqPayCallbackData } from "../types/payment";

export class LiqPayService {
    private static readonly PRIVATE_KEY = LIQPAY_CONFIG.privateKey;

    /**
     * Генерирует уникальный ID заказа
     */
    static generateOrderId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 100000);
        return `order_${timestamp}_${random}`;
    }

    /**
     * Создает подпись для данных платежа
     */
    static createSignature(data: string): string {
        return crypto
            .createHash("sha1")
            .update(this.PRIVATE_KEY + data + this.PRIVATE_KEY)
            .digest("base64");
    }

    /**
     * Проверяет подпись от LiqPay
     */
    static verifySignature(data: string, signature: string): boolean {
        const calculatedSignature = this.createSignature(data);
        return calculatedSignature === signature;
    }

    /**
     * Кодирует данные в base64
     */
    static encodeData(data: LiqPayPaymentData): string {
        const json = JSON.stringify(data);
        return Buffer.from(json).toString("base64");
    }

    /**
     * Декодирует данные из base64
     */
    static decodeData(data: string): LiqPayCallbackData {
        const json = Buffer.from(data, "base64").toString();
        return JSON.parse(json) as LiqPayCallbackData;
    }

    /**
     * Создает данные для платежа
     */
    static createPaymentData(params: {
        amount: number;
        description: string;
        orderId: string;
        sessionId: number;
        seats: Array<{ row: number; col: number }>;
    }): { data: string; signature: string } {
        const paymentData: LiqPayPaymentData = {
            public_key: LIQPAY_CONFIG.publicKey,
            version: LIQPAY_CONFIG.version,
            action: LIQPAY_CONFIG.action,
            amount: params.amount.toString(),
            currency: LIQPAY_CONFIG.currency,
            description: params.description,
            order_id: params.orderId,
            sandbox: LIQPAY_CONFIG.sandbox,
            result_url: this.buildResultUrl(params.orderId, params.sessionId, params.seats),
            server_url: `${getBaseUrl()}/api/payment/callback`,
        };

        const encodedData = this.encodeData(paymentData);
        const signature = this.createSignature(encodedData);

        return { data: encodedData, signature };
    }

    /**
     * Строит URL для редиректа после успешной оплаты
     */
    private static buildResultUrl(
        orderId: string,
        sessionId: number,
        seats: Array<{ row: number; col: number }>
    ): string {
        const baseUrl = getBaseUrl();
        const params = new URLSearchParams({
            orderId,
            sessionId: sessionId.toString(),
            seats: encodeURIComponent(JSON.stringify(seats)),
        });
        return `${baseUrl}/payment/success?${params.toString()}`;
    }

    /**
     * Проверяет, является ли статус платежа успешным
     */
    static isPaymentSuccessful(status: string): boolean {
        return status === "success" || status === "sandbox";
    }
}

