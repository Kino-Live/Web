import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    lastName: string;
    city: string;
    phone: string;
    dateOfBirth: string;
    avatar: string;
}

interface UseProfileReturn {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Хук для работы с профилем пользователя
 */
export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/profile");
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Please log in to view your profile");
                }
                throw new Error("Failed to load profile");
            }
            const data: { user: UserProfile } = await res.json();
            setProfile(data.user);
            setLoading(false);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
        try {
            setError(null);
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const responseData: { user: UserProfile } = await res.json();
            setProfile(responseData.user);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
            throw e;
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, updateProfile, refetch: fetchProfile };
}
