"use client";

import { useState, useMemo } from "react";
import { useUserTickets } from "@/app/lib/hooks/useTickets";
import type { TicketsBySession } from "@/app/lib/types/ticket";
import SessionPanel from "./session-panel";
import TicketCard from "./ticket-card";
import TotalSummary from "./total-summary";

/**
 * Основной компонент для отображения списка билетов пользователя
 */
export default function TicketsList() {
    const { tickets, loading, error } = useUserTickets();
    const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());

    // Группируем билеты по сеансам
    const ticketsBySession = useMemo<TicketsBySession>(() => {
        return tickets.reduce((acc, ticket) => {
            const sessionId = ticket.sessionId;
            if (!acc[sessionId]) {
                acc[sessionId] = [];
            }
            acc[sessionId].push(ticket);
            return acc;
        }, {} as TicketsBySession);
    }, [tickets]);

    const toggleSession = (sessionId: number) => {
        setExpandedSessions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
            } else {
                newSet.add(sessionId);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-white text-lg">Loading your tickets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-red-400 text-lg">{error}</p>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-gray-400 text-lg mb-4">
                    You don't have any tickets yet.
                </p>
                <a
                    href="/movies"
                    className="text-green-400 hover:text-green-300 underline transition-colors"
                >
                    Browse movies
                </a>
            </div>
        );
    }

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes ticketSlideIn {
                            from {
                                opacity: 0;
                                transform: translateY(20px) scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }
                    `,
                }}
            />
            <div className="space-y-4">
                {Object.entries(ticketsBySession).map(([sessionId, sessionTickets]) => {
                    const firstTicket = sessionTickets[0];
                    const { movie, session } = firstTicket;
                    const isExpanded = expandedSessions.has(Number(sessionId));
                    const totalAmount = sessionTickets.length * session.price;

                    return (
                        <div key={sessionId} className="space-y-4">
                            <SessionPanel
                                sessionId={Number(sessionId)}
                                tickets={sessionTickets}
                                movie={movie}
                                session={session}
                                isExpanded={isExpanded}
                                onToggle={() => toggleSession(Number(sessionId))}
                            />

                            {isExpanded && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {sessionTickets.map((ticket, index) => (
                                            <TicketCard
                                                key={ticket.id}
                                                ticket={ticket}
                                                index={index}
                                            />
                                        ))}
                                    </div>

                                    <TotalSummary
                                        ticketCount={sessionTickets.length}
                                        totalAmount={totalAmount}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
