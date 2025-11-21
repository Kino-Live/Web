"use client";

import Button from "@/app/components/ui/button";

interface PaymentSuccessProps {
    onGoToMovies?: () => void;
    onViewTickets?: () => void;
}

export default function PaymentSuccess({
    onGoToMovies,
    onViewTickets,
}: PaymentSuccessProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="mb-6">
                    <svg
                        className="w-24 h-24 mx-auto text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                    Payment Successful!
                </h2>
                <p className="text-gray-400 mb-8">
                    Your tickets have been booked successfully.
                </p>
                <div className="flex gap-4 justify-center">
                    {onGoToMovies && (
                        <Button
                            onClick={onGoToMovies}
                            variant="primary"
                            className="px-8 py-3"
                        >
                            Go to Movies
                        </Button>
                    )}
                    {onViewTickets && (
                        <Button
                            onClick={onViewTickets}
                            variant="outline"
                            className="px-8 py-3"
                        >
                            View My Tickets
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

