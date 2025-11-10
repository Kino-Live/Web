interface LegendItemProps {
    color: string;
    borderColor: string;
    label: string;
}

export default function LegendItem({
    color,
    borderColor,
    label,
}: LegendItemProps) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-6 h-6 ${color} border ${borderColor} rounded`}></div>
            <span className="text-md">{label}</span>
        </div>
    );
}

