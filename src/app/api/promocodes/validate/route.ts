import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";
import type { Promocode, PromocodeValidationResult } from "@/app/lib/types/promocode";

/**
 * POST - Валидация промокода
 * Body: { code: string }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code || typeof code !== "string") {
            return NextResponse.json(
                {
                    valid: false,
                    message: "Промокод не найден",
                } as PromocodeValidationResult,
                { status: 400 }
            );
        }

        // Преобразуем код в верхний регистр
        const upperCode = code.trim().toUpperCase();

        // Ищем промокод в базе данных
        const promocodesResponse = await fetch(
            `${API_BASE_URL}/promocodes?code=${upperCode}`
        );

        if (!promocodesResponse.ok) {
            throw new Error("Failed to fetch promocodes");
        }

        const promocodes: Promocode[] = await promocodesResponse.json();

        if (!promocodes || promocodes.length === 0) {
            return NextResponse.json({
                valid: false,
                message: "Promo code not found",
            } as PromocodeValidationResult);
        }

        const promocode = promocodes[0];

        // Проверяем активность
        if (!promocode.isActive) {
            return NextResponse.json({
                valid: false,
                promocode,
                message: "Promocode expired",
            } as PromocodeValidationResult);
        }

        // Проверяем даты
        const now = new Date();
        const startsAt = new Date(promocode.startsAt);
        const expiresAt = new Date(promocode.expiresAt);

        if (now < startsAt) {
            return NextResponse.json({
                valid: false,
                promocode,
                message: "Promocode is not active yet",
            } as PromocodeValidationResult);
        }

        if (now > expiresAt) {
            return NextResponse.json({
                valid: false,
                promocode,
                message: "Promocode expired",
            } as PromocodeValidationResult);
        }

        // Промокод валиден
        return NextResponse.json({
            valid: true,
            promocode,
            message: `Promocode applied, discount ${promocode.value}%`,
        } as PromocodeValidationResult);
    } catch (error) {
        console.error("Error validating promocode:", error);
        return NextResponse.json(
            {
                valid: false,
                message: "Error validating promocode",
            } as PromocodeValidationResult,
            { status: 500 }
        );
    }
}
