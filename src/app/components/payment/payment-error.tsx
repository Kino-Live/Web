"use client";

import Button from "@/app/components/ui/button";

interface PaymentErrorProps {
    error: string;
    onBack?: () => void;
    backLabel?: string;
}

export default function PaymentError({
    error,
    onBack,
    backLabel = "Go Back",
}: PaymentErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-400 text-xl mb-4">{error}</div>
                {onBack && (
                    <Button onClick={onBack} variant="primary">
                        {backLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}

