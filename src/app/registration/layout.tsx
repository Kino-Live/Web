import RegistrationDecor from "@/components/layout/registration-bg";

export default function RegistrationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <RegistrationDecor />
            {children}
        </>
    );
}
