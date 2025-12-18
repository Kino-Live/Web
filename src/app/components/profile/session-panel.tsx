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
}: SessionPanelProps) {
    return (
        <div
            onClick={onToggle}
            className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg p-4 border border-emerald-500/20 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-900/30 hover:to-teal-900/30 hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-[1.02]"
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
                        <ChevronUpIcon className="h-5 w-5 text-emerald-400 transition-transform duration-300" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-emerald-400 transition-transform duration-300" />
                    )}
                </div>
            </div>
        </div>
    );
}
