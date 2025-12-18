import type { TotalSummaryProps } from "@/app/lib/types/ticket";

/**
 * Компонент для отображения итоговой суммы за сеанс
 */
export default function TotalSummary({
    ticketCount,
    totalAmount,
    isPast = false,
}: TotalSummaryProps) {
    // Цвета для прошедших билетов
    const containerClasses = isPast
        ? "bg-gradient-to-r from-gray-900/30 via-gray-800/30 to-gray-900/30 border-gray-600/20"
        : "bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30 border-emerald-500/20";
    
    const textColor = isPast ? "text-gray-300" : "text-emerald-100";
    const amountColor = isPast ? "text-gray-400" : "text-emerald-300";

    return (
        <div className={`${containerClasses} rounded-lg p-4 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className={`${textColor} text-sm`}>
                        Total Amount for {ticketCount} ticket
                        {ticketCount > 1 ? "s" : ""}:
                    </p>
                </div>
                <div className={`${amountColor} font-bold text-xl`}>
                    {totalAmount} UAH
                </div>
            </div>
        </div>
    );
}
