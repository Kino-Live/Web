export const LIQPAY_CONFIG = {
    publicKey: process.env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY || "sandbox_i91911055214",
    privateKey: process.env.LIQPAY_PRIVATE_KEY || "sandbox_3OLgdJAZ7FmH9xWSZah4wE09iVAEzS6tU5NlpoPO",
    version: "3",
    action: "pay" as const,
    currency: "UAH" as const,
    sandbox: process.env.NODE_ENV === "development" ? "1" : "0",
    checkoutUrl: "https://www.liqpay.ua/api/3/checkout",
} as const;

export const PAYMENT_ROUTES = {
    generate: "/api/payment/generate",
    callback: "/api/payment/callback",
    success: "/payment/success",
} as const;

export function getBaseUrl(): string {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

