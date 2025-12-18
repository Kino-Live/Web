"use client";

import { useState } from "react";
import TicketsList from "./tickets-list";
import type { UserTicket } from "@/app/lib/hooks/useTickets";
import { isSessionPast } from "@/app/lib/utils/ticket";

type TabType = "upcoming" | "history";

interface TicketsTabsProps {
    tickets: UserTicket[];
    loading: boolean;
    error: string | null;
}

/**
 * Компонент табов для переключения между предстоящими и историей билетов
 */
export default function TicketsTabs({ tickets, loading, error }: TicketsTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>("upcoming");

    // Фильтруем билеты по выбранной вкладке
    const filteredTickets = tickets.filter((ticket) => {
        const isPast = isSessionPast(ticket.session.date, ticket.session.time);
        return activeTab === "history" ? isPast : !isPast;
    });

    return (
        <div>
            {/* Табы */}
            <div className="flex gap-4 mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`pb-3 px-4 font-medium transition-colors ${
                        activeTab === "upcoming"
                            ? "text-green-400 border-b-2 border-green-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-3 px-4 font-medium transition-colors ${
                        activeTab === "history"
                            ? "text-green-400 border-b-2 border-green-400"
                            : "text-gray-400 hover:text-white"
                    }`}
                >
                    History
                </button>
            </div>

            {/* Контент таба */}
            <TicketsList tickets={filteredTickets} loading={loading} error={error} />
        </div>
    );
}
