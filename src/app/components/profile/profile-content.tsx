"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProfileForm from "./profile-form";
import TicketsTabs from "./tickets-tabs";
import { useUserTickets } from "@/app/lib/hooks/useTickets";

type TabType = "profile" | "tickets";

/**
 * Компонент контента профиля с табами
 */
export default function ProfileContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tabParam = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState<TabType>(
        tabParam === "tickets" ? "tickets" : "profile"
    );
    const { tickets, loading, error } = useUserTickets();

    // Обновляем активную вкладку при изменении URL параметра
    useEffect(() => {
        if (tabParam === "tickets") {
            setActiveTab("tickets");
        } else if (tabParam === "profile") {
            setActiveTab("profile");
        }
    }, [tabParam]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        // Обновляем URL без перезагрузки страницы
        const newUrl = tab === "tickets" ? "/profile?tab=tickets" : "/profile";
        router.replace(newUrl);
    };

    return (
        <div>
            {/* Табы */}
            <div className="flex gap-4 mb-6 border-b border-white/10">
                <button
                    onClick={() => handleTabChange("profile")}
                    className={`pb-3 px-4 font-medium transition-colors ${
                        activeTab === "profile"
                            ? "text-green-400 border-b-2 border-green-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => handleTabChange("tickets")}
                    className={`pb-3 px-4 font-medium transition-colors ${
                        activeTab === "tickets"
                            ? "text-green-400 border-b-2 border-green-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    Tickets
                </button>
            </div>

            {/* Контент таба */}
            {activeTab === "profile" ? (
                <ProfileForm />
            ) : (
                <TicketsTabs tickets={tickets} loading={loading} error={error} />
            )}
        </div>
    );
}
