export default function PaymentLoading({ message = "Loading..." }: { message?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-xl">{message}</div>
        </div>
    );
}

