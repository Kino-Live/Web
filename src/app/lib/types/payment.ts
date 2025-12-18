export interface PaymentRequest {
    amount: number;
    description: string;
    sessionId: number;
    seats: Array<{ row: number; col: number }>;
}

export interface PaymentResponse {
    data: string;
    signature: string;
    orderId: string;
}

export interface LiqPayPaymentData {
    public_key: string;
    version: string;
    action: "pay";
    amount: string;
    currency: "UAH" | "USD" | "EUR";
    description: string;
    order_id: string;
    sandbox: "1" | "0";
    result_url: string;
    server_url: string;
}

export interface LiqPayCallbackData {
    status: "success" | "sandbox" | "failure" | "error" | "wait_secure" | "wait_accept" | "wait_lc" | "processing";
    order_id: string;
    payment_id?: string;
    amount?: number;
    currency?: string;
    description?: string;
    [key: string]: unknown;
}

export interface PaymentParams {
    sessionId: string;
    seats: string; // JSON encoded
    amount: string;
    description: string;
}

export interface PaymentSuccessParams extends PaymentParams {
    orderId: string;
}

export interface CreateTicketsRequest {
    sessionId: number;
    seats: Array<{ row: number; col: number }>;
    userId?: string | null; // Опционально, так как получается из сессии на сервере
}

export interface CreateTicketsResponse {
    message: string;
    tickets?: Array<{
        id: number | string;
        sessionId: number;
        row: number;
        col: number;
        userId: string | null;
    }>;
}

export enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SUCCESS = "success",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

