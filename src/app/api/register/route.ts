import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const API_BASE_URL = "http://localhost:5000";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const existingUserResponse = await fetch(
            `${API_BASE_URL}/users?email=${encodeURIComponent(email)}`
        );

        const existingUsers = await existingUserResponse.json();

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { message: "Пользователь с таким email уже зарегистрирован" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const res = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                password: hashedPassword,
            }),
        });

        if (!res.ok) {
            throw new Error("Ошибка создания пользователя");
        }

        const { password: _, ...userSafe } = await res.json();

        return NextResponse.json(
            {
                message: "Пользователь успешно зарегистрирован",
                user: userSafe,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "Ошибка сервера. Попробуйте позже." },
            { status: 500 }
        );
    }
}
