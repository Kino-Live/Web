/**
 * Типы для системы промокодов
 */

export interface Promocode {
    id: string | number;
    code: string; // В верхнем регистре
    value: number; // Процент скидки (например, 10 для 10%)
    isActive: boolean;
    startsAt: string; // ISO date string
    expiresAt: string; // ISO date string
}

export interface PromocodeValidationResult {
    valid: boolean;
    promocode?: Promocode;
    message: string;
}

export interface PromocodeDiscount {
    originalPrice: number;
    discount: number;
    finalPrice: number;
    promocode?: Promocode;
}
