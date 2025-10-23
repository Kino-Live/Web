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
                { message: "User with this email already exist" },
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

        const createdUser = await res.json();

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: createdUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}
