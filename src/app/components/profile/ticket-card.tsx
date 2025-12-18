import type { TicketCardProps } from "@/app/lib/types/ticket";
import {
    formatDateLong,
    formatTime,
    formatDuration,
    getSeatLetter,
    formatTicketId,
    formatReferenceNumber,
} from "@/app/lib/utils/ticket";

/**
 * Компонент для отображения отдельного билета
 */
export default function TicketCard({ ticket, index, isPast = false }: TicketCardProps) {
    const { movie, session } = ticket;
    const seatLetter = getSeatLetter(ticket.row);
    const ticketId = formatTicketId(ticket.id);
    const referenceNumber = formatReferenceNumber(ticket.id);

    // Цвета для прошедших билетов (более тусклые, серые)
    const cardClasses = isPast
        ? "bg-gradient-to-br from-gray-600 via-gray-500 to-gray-600 opacity-75"
        : "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500";
    
    const borderClasses = isPast
        ? "border-gray-700/50"
        : "border-emerald-700/50";

    const shadowStyle = isPast
        ? { boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }
        : { boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" };

    return (
        <div
            className={`${cardClasses} rounded-lg p-6 w-full max-w-sm relative overflow-hidden transform transition-all duration-500 ${isPast ? "" : "hover:scale-105 hover:shadow-2xl"}`}
            style={{
                ...shadowStyle,
                animation: `ticketSlideIn 0.6s ease-out ${index * 0.1}s both`,
            }}
        >
            {/* Верхний перфорированный край */}
            <div className={`absolute top-0 left-0 right-0 h-2 border-b-2 border-dashed ${borderClasses}`} />

            {/* Логотип */}
            <div className="text-center mb-4">
                <div className="text-indigo-100 font-bold text-lg drop-shadow-lg">
                    KinoLive
                </div>
            </div>

            {/* Название фильма */}
            <h4 className="text-2xl font-bold text-white mb-2 text-center">
                {movie.title}
            </h4>

            {/* Детали фильма */}
            <div className="text-center text-white/90 text-sm mb-4">
                {formatDuration(movie.Duration)} | {movie.Genre || "Movie"}
            </div>

            {/* Разделительная линия */}
            <div className="border-t-2 border-dashed border-white/30 my-4" />

            {/* Детали сеанса */}
            <div className="space-y-2 text-white mb-4">
                <TicketDetail label="Date:" value={formatDateLong(session.date)} />
                <TicketDetail label="Time:" value={formatTime(session.time)} />
                <TicketDetail label="Hall No:" value={`Hall ${session.hallId}`} />
                <TicketDetail label="Seat:" value={`${seatLetter}${ticket.col}`} />
                <TicketDetail
                    label="Location:"
                    value='Kharkiv, Mall "Nikolsky"'
                    alignRight
                />
            </div>

            {/* Разделительная линия */}
            <div className="border-t-2 border-dashed border-white/30 my-4" />

            {/* Ticket ID и цена */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-xs">{ticketId}</span>
                <span className="text-white font-bold text-lg">
                    {session.price} UAH
                </span>
            </div>

            {/* Reference Number */}
            <div className="text-center">
                <div className="text-white/70 text-xs">{referenceNumber}</div>
            </div>

            {/* Нижний перфорированный край */}
            <div className={`absolute bottom-0 left-0 right-0 h-2 border-t-2 border-dashed ${borderClasses}`} />
        </div>
    );
}

/**
 * Вспомогательный компонент для отображения детали билета
 */
function TicketDetail({
    label,
    value,
    alignRight = false,
}: {
    label: string;
    value: string;
    alignRight?: boolean;
}) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-white/80">{label}</span>
            <span
                className={`font-semibold ${alignRight ? "text-right max-w-[60%]" : ""}`}
            >
                {value}
            </span>
        </div>
    );
}
