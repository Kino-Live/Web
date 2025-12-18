import type { TotalSummaryProps } from "@/app/lib/types/ticket";

/**
 * Компонент для отображения итоговой суммы за сеанс
 */
export default function TotalSummary({
    ticketCount,
    totalAmount,
}: TotalSummaryProps) {
    return (
        <div className="bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-cyan-900/30 rounded-lg p-4 border border-emerald-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-emerald-100 text-sm">
                        Total Amount for {ticketCount} ticket
                        {ticketCount > 1 ? "s" : ""}:
                    </p>
                </div>
                <div className="text-emerald-300 font-bold text-xl">
                    {totalAmount} UAH
                </div>
            </div>
        </div>
    );
}
