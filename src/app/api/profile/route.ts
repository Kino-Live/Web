import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/lib/config";
import { auth } from "@/auth";

/**
 * GET - Получение профиля текущего пользователя
 */
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id || null;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user");
        }

        const user = await userResponse.json();
        
        // Не возвращаем пароль
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(
            { user: userWithoutPassword },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}

/**
 * PUT - Обновление профиля текущего пользователя
 */
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id || null;

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, lastName, city, phone, dateOfBirth, email, avatar } = body;

        // Получаем текущего пользователя
        const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!userResponse.ok) {
            throw new Error("Failed to fetch user");
        }

        const currentUser = await userResponse.json();

        // Подготавливаем данные для обновления
        const updateData: Record<string, any> = {};

        if (name !== undefined) updateData.name = name;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (city !== undefined) updateData.city = city;
        if (phone !== undefined) updateData.phone = phone;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (email !== undefined) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar;

        // Обновляем пользователя
        const updateResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update user");
        }

        const updatedUser = await updateResponse.json();
        const { password, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                user: userWithoutPassword,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { message: "Server Error." },
            { status: 500 }
        );
    }
}
