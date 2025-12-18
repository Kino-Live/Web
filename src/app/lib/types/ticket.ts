import type { UserTicket } from "@/app/lib/hooks/useTickets";

/**
 * Группированные билеты по сеансам
 */
export type TicketsBySession = Record<number, UserTicket[]>;

/**
 * Пропсы для компонента билета
 */
export interface TicketCardProps {
    ticket: UserTicket;
    index: number;
}

/**
 * Пропсы для панели сеанса
 */
export interface SessionPanelProps {
    sessionId: number;
    tickets: UserTicket[];
    movie: UserTicket["movie"];
    session: UserTicket["session"];
    isExpanded: boolean;
    onToggle: () => void;
}

/**
 * Пропсы для итоговой суммы
 */
export interface TotalSummaryProps {
    ticketCount: number;
    totalAmount: number;
}
