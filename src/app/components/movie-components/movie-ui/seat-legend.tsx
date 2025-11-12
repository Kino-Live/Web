interface LegendItemProps {
    color: string;
    borderColor: string;
    label: string;
}

function LegendItem({ color, borderColor, label }: LegendItemProps) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`w-6 h-6 ${color} border ${borderColor} rounded`}></div>
            <span className="text-md">{label}</span>
        </div>
    );
}

export default function SeatLegend() {
    return (
        <div className="flex justify-center gap-4 mb-6">
            <LegendItem
                color="bg-white"
                borderColor="border-gray-500"
                label="Available"
            />
            <LegendItem
                color="bg-green-400"
                borderColor="border-green-500"
                label="Selected"
            />
            <LegendItem
                color="bg-red-600"
                borderColor="border-red-700"
                label="Occupied"
            />
        </div>
    );
}

