"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTicketCreation } from "@/app/lib/hooks/useTicketCreation";
import { parsePaymentSuccessParams, decodeSeats } from "@/app/lib/utils/payment";
import PaymentLoading from "@/app/components/payment/payment-loading";
import PaymentError from "@/app/components/payment/payment-error";
import PaymentSuccess from "@/app/components/payment/payment-success";

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { createTickets, loading, error: creationError } = useTicketCreation();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const params = parsePaymentSuccessParams(searchParams);

        if (!params) {
            setError("Missing or invalid payment parameters");
            return;
        }

        const seats = decodeSeats(params.seats);

        createTickets({
            sessionId: parseInt(params.sessionId),
            seats,
        })
            .then(() => {
                setSuccess(true);
            })
            .catch(() => {
                // Ошибка уже установлена в хуке
            });
    }, [searchParams, createTickets]);

    const handleGoToMovies = () => {
        router.push("/movies");
    };

    const handleViewTickets = () => {
        router.push("/profile?tab=tickets");
    };

    if (loading) {
        return <PaymentLoading message="Processing your payment..." />;
    }

    if (error || creationError) {
        return (
            <PaymentError
                error={error || creationError || "Unknown error"}
                onBack={handleGoToMovies}
                backLabel="Go to Movies"
            />
        );
    }

    if (success) {
        return (
            <PaymentSuccess
                onGoToMovies={handleGoToMovies}
                onViewTickets={handleViewTickets}
            />
        );
    }

    return null;
}
