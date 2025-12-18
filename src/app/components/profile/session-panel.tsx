import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { formatDateShort } from "@/app/lib/utils/date";
import type { SessionPanelProps } from "@/app/lib/types/ticket";

/**
 * Компонент для отображения компактной панели сеанса
 */
export default function SessionPanel({
    sessionId,
    tickets,
    movie,
    session,
    isExpanded,
    onToggle,
    isPast = false,
}: SessionPanelProps) {
    // Цвета для прошедших сеансов
    const panelClasses = isPast
        ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-600/20 hover:from-gray-700/30 hover:to-gray-800/30 hover:border-gray-500/40"
        : "bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-emerald-500/20 hover:from-emerald-900/30 hover:to-teal-900/30 hover:border-emerald-400/40";
    
    const iconColor = isPast ? "text-gray-400" : "text-emerald-400";

    return (
        <div
            onClick={onToggle}
            className={`${panelClasses} rounded-lg p-4 cursor-pointer transition-all duration-300 transform ${isPast ? "" : "hover:scale-[1.02]"}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onToggle();
                }
            }}
            aria-expanded={isExpanded}
            aria-controls={`tickets-${sessionId}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={80}
                        height={120}
                        className="rounded-lg"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {formatDateShort(session.date)} • {session.time}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-white font-medium">
                        Total: {tickets.length} ticket{tickets.length > 1 ? "s" : ""}
                    </p>
                    {isExpanded ? (
                        <ChevronUpIcon className={`h-5 w-5 ${iconColor} transition-transform duration-300`} />
                    ) : (
                        <ChevronDownIcon className={`h-5 w-5 ${iconColor} transition-transform duration-300`} />
                    )}
                </div>
            </div>
        </div>
    );
}
