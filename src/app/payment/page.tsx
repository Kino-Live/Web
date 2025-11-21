"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePayment } from "@/app/lib/hooks/usePayment";
import { parsePaymentParams, decodeSeats } from "@/app/lib/utils/payment";
import PaymentForm from "@/app/components/payment/payment-form";
import PaymentLoading from "@/app/components/payment/payment-loading";
import PaymentError from "@/app/components/payment/payment-error";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { generatePayment, loading, error: paymentError } = usePayment();
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<{
        data: string;
        signature: string;
        orderId: string;
    } | null>(null);

    useEffect(() => {
        const params = parsePaymentParams(searchParams);

        if (!params) {
            setError("Missing or invalid payment parameters");
            return;
        }

        const seats = decodeSeats(params.seats);

        generatePayment({
            amount: parseFloat(params.amount),
            description: params.description,
            sessionId: parseInt(params.sessionId),
            seats,
        })
            .then((data) => {
                setPaymentData(data);
            })
            .catch(() => {
                // Ошибка уже установлена в хуке
            });
    }, [searchParams, generatePayment]);

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return <PaymentLoading message="Loading payment form..." />;
    }

    if (error || paymentError) {
        return (
            <PaymentError
                error={error || paymentError || "Unknown error"}
                onBack={handleCancel}
            />
        );
    }

    if (!paymentData) {
        return <PaymentLoading message="Initializing payment..." />;
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <PaymentForm paymentData={paymentData} onCancel={handleCancel} />
            </div>
        </div>
    );
}
