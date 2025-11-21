"use client";

import type { PaymentResponse } from "@/app/lib/types/payment";
import { LIQPAY_CONFIG } from "@/app/lib/config/payment";
import Button from "@/app/components/ui/button";

interface PaymentFormProps {
    paymentData: PaymentResponse;
    onCancel?: () => void;
}

export default function PaymentForm({ paymentData, onCancel }: PaymentFormProps) {
    return (
        <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
                Payment
            </h2>
            <p className="text-gray-400 text-center mb-8">
                You will be redirected to LiqPay payment page
            </p>
            <form
                method="POST"
                action={LIQPAY_CONFIG.checkoutUrl}
                acceptCharset="utf-8"
                id="payment-form"
            >
                <input type="hidden" name="data" value={paymentData.data} />
                <input
                    type="hidden"
                    name="signature"
                    value={paymentData.signature}
                />
                <div className="flex gap-4 justify-center">
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-8 py-3"
                    >
                        Proceed to Payment
                    </Button>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="px-8 py-3"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

