import { ReactNode } from "react";

interface InfoCardProps {
    icon: ReactNode;
    primaryText: string | ReactNode;
    secondaryText?: string | ReactNode;
}

export default function InfoCard({
    icon,
    primaryText,
    secondaryText,
}: InfoCardProps) {
    return (
        <div className="flex border border-white/40 rounded-lg" >
            <div className="p-4 bg-white/10 rounded-l-lg flex items-center justify-center border-r border-white/40">
                <div className="text-gray-300">{icon}</div>
            </div>
            <div className="py-2 px-6 rounded-r-lg text-center">
                {primaryText}
                {secondaryText && (
                    <div className="text-md font-bold">{secondaryText}</div>
                )}
            </div>
        </div>
    );
}

